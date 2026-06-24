import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cashfree } from "@/lib/cashfree";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    if (!type || !itemId || !amount || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let packageDetails = null;

    if (type === 'puja') {
      const { data: puja } = await supabase.from('pujas').select('packages').eq('id', itemId).single();
      if (puja && puja.packages && packageId) {
        packageDetails = puja.packages.find((p: any) => p.id === packageId) || null;
      } else if (puja && puja.packages && puja.packages.length > 0) {
        packageDetails = puja.packages[0];
      }
    }

    // 1. Create Order in Supabase
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_type: type,
        puja_id: type === 'puja' ? itemId : null,
        chadhava_item_id: type === 'chadhava' ? itemId : null,
        status: 'booked',
        amount: amount,
        final_amount: amount,
        package_details: packageDetails,
      })
      .select()
      .single();

    if (dbError || !dbOrder) {
      console.error("Supabase Order Error:", dbError);
      return NextResponse.json({ error: "Failed to create order record" }, { status: 500 });
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
      order_amount: amount,
      order_currency: "INR",
      order_id: cashfreeOrderId,
      customer_details: {
        customer_id: user.id.replace(/-/g, ''),
        customer_phone: customerPhone,
        customer_name: customerName || "Devotee",
        customer_email: customerEmail || user.email || "devotee@devmandir.app",
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/book/confirmation?order_id=${dbOrder.id}&cf_id={order_id}`,
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
    console.error("Create Order API Error:", error?.response?.data || error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
