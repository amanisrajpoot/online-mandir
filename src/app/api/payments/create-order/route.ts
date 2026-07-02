import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cashfree } from "@/lib/cashfree";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get origin from request headers for dynamic redirect URL
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, // 'puja' or 'chadhava'
      itemId, // puja_id or chadhava_item_id
      amount, // Total amount in INR
      customerName,
      customerPhone,
      customerEmail,
      sankalpDetails,
      deliveryAddress,
      packageId,
    } = body;

    if (!type || !itemId || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let packageDetails = null;
    let actualAmount = 0;

    if (type === 'puja') {
      const { data: puja, error: fetchError } = await supabase.from('pujas').select('sale_price, packages').eq('id', itemId).single();
      
      if (fetchError || !puja) {
        return NextResponse.json({ error: "Puja not found" }, { status: 404 });
      }

      if (puja.packages && packageId) {
        packageDetails = puja.packages.find((p: any) => p.id === packageId) || null;
        if (!packageDetails) {
            return NextResponse.json({ error: "Selected package not found" }, { status: 404 });
        }
        actualAmount = packageDetails.price;
      } else if (puja.packages && puja.packages.length > 0) {
        packageDetails = puja.packages[0];
        actualAmount = packageDetails.price;
      } else {
        actualAmount = puja.sale_price;
      }
    } else if (type === 'chadhava') {
      const { data: chadhava, error: fetchError } = await supabase.from('chadhava_items').select('price').eq('id', itemId).single();
      if (fetchError || !chadhava) {
        return NextResponse.json({ error: "Chadhava item not found" }, { status: 404 });
      }
      actualAmount = chadhava.price;
    } else {
      return NextResponse.json({ error: "Invalid order type" }, { status: 400 });
    }

    // 1. Create Order in Supabase
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_type: type,
        item_id: itemId,
        status: 'pending',
        amount: actualAmount,
        package_details: packageDetails,
      })
      .select()
      .single();

    if (dbError || !dbOrder) {
      console.error("Supabase Order Error:", dbError);
      return NextResponse.json({ error: `Failed to create order record: ${dbError?.message || 'Unknown error'}` }, { status: 500 });
    }

    // 2. Insert Sankalp and Address if provided
    if (sankalpDetails) {
      await supabase.from('sankalp_details').insert({
        order_id: dbOrder.id,
        devotee_name: sankalpDetails.name,
        gotra: sankalpDetails.gotra,
        wish: sankalpDetails.wish,
        additional_members: sankalpDetails.additional_members || []
      });
    }

    if (deliveryAddress) {
      await supabase.from('delivery_addresses').insert({
        user_id: user.id,
        order_id: dbOrder.id,
        name: deliveryAddress.name,
        phone: deliveryAddress.phone,
        address_line: deliveryAddress.address_line,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pincode
      });
    }

    // 3. Create Cashfree Order
    const cashfreeOrderId = `order_${dbOrder.id.replace(/-/g, '')}`;
    
    const requestArgs = {
      order_amount: actualAmount,
      order_currency: "INR",
      order_id: cashfreeOrderId,
      customer_details: {
        customer_id: user.id.replace(/-/g, ''),
        customer_phone: customerPhone,
        customer_name: customerName || "Devotee",
        customer_email: customerEmail || user.email || "devotee@devmandir.app",
      },
      order_meta: {
        return_url: `${origin}/book/confirmation?order_id=${dbOrder.id}&cf_id={order_id}`,
      }
    };

    const response = await cashfree.PGCreateOrder(requestArgs);
    const cfOrder = response.data;

    // 4. Update Supabase Order with Cashfree details
    await supabase
      .from('orders')
      .update({
        cashfree_order_id: cfOrder.order_id,
        cashfree_session_id: cfOrder.payment_session_id
      })
      .eq('id', dbOrder.id);

    return NextResponse.json({ 
      orderId: dbOrder.id,
      cashfreeOrderId: cfOrder.order_id,
      paymentSessionId: cfOrder.payment_session_id 
    });

  } catch (error: any) {
    const cfErrorData = error?.response?.data;
    console.error("Create Order API Error:", cfErrorData || error);
    const errorMessage = cfErrorData?.message || error.message || "Internal Server Error";
    return NextResponse.json({ error: `Cashfree Error: ${errorMessage}` }, { status: 500 });
  }
}
