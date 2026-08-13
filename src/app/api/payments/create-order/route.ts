import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cashfree } from "@/lib/cashfree";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Get origin from request headers for dynamic redirect URL
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Initialize Admin Client to bypass RLS for backend order creation
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { 
      type, // 'puja', 'chadhava', or 'donation'
      itemId, // puja_id, chadhava_item_id, or donation category slug
      amount, // Total amount in INR
      customerName,
      customerPhone,
      customerEmail,
      sankalpDetails,
      deliveryAddress,
      packageId,
      // Donation-specific
      donorName,
      donorMessage,
      isAnonymous,
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
    } else if (type === 'donation') {
      // Validate minimum amount
      if (!amount || amount < 1) {
        return NextResponse.json({ error: "Minimum donation amount is ₹1" }, { status: 400 });
      }
      actualAmount = amount;
    } else {
      return NextResponse.json({ error: "Invalid order type" }, { status: 400 });
    }
    
    // Link to existing user if guest uses a registered phone number
    let orderUserId = user?.id || null;
    if (!orderUserId && customerPhone) {
      const searchPhone = customerPhone.replace('+', '');
      const searchPhoneWithoutCountry = searchPhone.startsWith('91') ? searchPhone.substring(2) : searchPhone;
      
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      if (usersData?.users) {
        const existingUser = usersData.users.find(u => 
          u.phone === customerPhone || 
          u.phone === searchPhone || 
          u.phone === searchPhoneWithoutCountry ||
          u.phone === `+91${searchPhoneWithoutCountry}`
        );
        if (existingUser) {
          orderUserId = existingUser.id;
        }
      }
    }

    // 1. Create Order in Supabase
    let dbOrder: any;

    if (type === 'donation') {
      // Find donation record by category slug
      const { data: donationRecord } = await supabaseAdmin
        .from('donations')
        .select('id')
        .eq('category', itemId)
        .single();

      const donationId = donationRecord?.id || null;

      const { data: donOrder, error: donError } = await supabaseAdmin
        .from('donation_orders')
        .insert({
          user_id: orderUserId,
          donation_id: donationId,
          amount: actualAmount,
          donor_name: isAnonymous ? null : (donorName || customerName || null),
          donor_message: donorMessage || null,
          is_anonymous: isAnonymous || false,
          customer_phone: customerPhone || null,
          status: 'pending',
        })
        .select()
        .single();

      if (donError || !donOrder) {
        console.error("Donation Order Error:", donError);
        return NextResponse.json({ error: `Failed to create donation record: ${donError?.message || 'Unknown error'}` }, { status: 500 });
      }
      dbOrder = donOrder;
    } else {
      const { data: regOrder, error: dbError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: orderUserId,
          order_type: type,
          item_id: itemId,
          status: 'pending',
          amount: actualAmount,
          package_details: packageDetails,
          customer_phone: customerPhone || null,
          customer_name: customerName || null,
        })
        .select()
        .single();

      if (dbError || !regOrder) {
        console.error("Supabase Order Error:", dbError);
        return NextResponse.json({ error: `Failed to create order record: ${dbError?.message || 'Unknown error'}` }, { status: 500 });
      }
      dbOrder = regOrder;
    }

    // 2. Insert Sankalp and Address if provided
    if (sankalpDetails) {
      await supabaseAdmin.from('sankalp_details').insert({
        order_id: dbOrder.id,
        devotee_name: sankalpDetails.name,
        gotra: sankalpDetails.gotra,
        wish: sankalpDetails.wish,
        additional_members: sankalpDetails.additional_members || []
      });
    }

    if (deliveryAddress) {
      await supabaseAdmin.from('delivery_addresses').insert({
        user_id: orderUserId,
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
    let returnUrl = type === 'donation'
      ? `${origin}/donate/confirmation?order_id=${dbOrder.id}&cf_id={order_id}&category=${itemId}`
      : `${origin}/book/confirmation?order_id=${dbOrder.id}&cf_id={order_id}&itemId=${itemId}`;
    
    // Cashfree strictly requires HTTPS for the return_url, even in local development.
    if (returnUrl.startsWith('http://')) {
      returnUrl = returnUrl.replace('http://', 'https://');
    }
    
    const requestArgs = {
      order_amount: actualAmount,
      order_currency: "INR",
      order_id: cashfreeOrderId,
      customer_details: {
        customer_id: user ? user.id.replace(/-/g, '') : `guest_${Date.now()}`,
        customer_phone: customerPhone || "9999999999",
        customer_name: customerName || "Devotee",
        customer_email: customerEmail || user?.email || "devotee@vandanam.online",
      },
      order_meta: {
        return_url: returnUrl,
      }
    };

    const response = await cashfree.PGCreateOrder(requestArgs);
    const cfOrder = response.data;

    // 4. Update record with Cashfree details
    const updateTable = type === 'donation' ? 'donation_orders' : 'orders';
    const updatePayload = type === 'donation'
      ? { cashfree_order_id: cfOrder.order_id, cashfree_session_id: cfOrder.payment_session_id }
      : { cashfree_order_id: cfOrder.order_id, cashfree_session_id: cfOrder.payment_session_id };

    await supabaseAdmin
      .from(updateTable)
      .update(updatePayload)
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
