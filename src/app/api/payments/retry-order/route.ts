import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cashfree } from "@/lib/cashfree";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { orderId, type } = body;

    if (!orderId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const table = type === 'donation' ? 'donation_orders' : 'orders';

    // Fetch the existing order
    const { data: dbOrder, error: fetchError } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !dbOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Only allow retry for pending or failed orders
    if (dbOrder.status === 'completed') {
      return NextResponse.json({ error: "Order is already completed" }, { status: 400 });
    }

    // Create a new Cashfree Order ID by appending a timestamp to make it unique for this retry
    const cashfreeOrderId = `order_${dbOrder.id.replace(/-/g, '')}_retry_${Date.now()}`;
    
    // Determine return URL
    let returnUrl = type === 'donation'
      ? `${origin}/donate/confirmation?order_id=${dbOrder.id}&cf_id={order_id}`
      : `${origin}/book/confirmation?order_id=${dbOrder.id}&cf_id={order_id}`;
    
    if (returnUrl.startsWith('http://')) {
      returnUrl = returnUrl.replace('http://', 'https://');
    }

    const customerPhone = dbOrder.customer_phone || user?.phone || "9999999999";
    const customerName = type === 'donation' 
      ? (dbOrder.donor_name || "Anonymous Donor")
      : (dbOrder.customer_name || "Devotee");

    const requestArgs = {
      order_amount: dbOrder.amount,
      order_currency: "INR",
      order_id: cashfreeOrderId,
      customer_details: {
        customer_id: dbOrder.user_id ? dbOrder.user_id.replace(/-/g, '') : `guest_${Date.now()}`,
        customer_phone: customerPhone,
        customer_name: customerName,
        customer_email: user?.email || "devotee@vandanam.online",
      },
      order_meta: {
        return_url: returnUrl,
      }
    };

    const response = await cashfree.PGCreateOrder(requestArgs);
    const cfOrder = response.data;

    // Update record with NEW Cashfree details
    await supabaseAdmin
      .from(table)
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
    console.error("Retry Order API Error:", cfErrorData || error);
    const errorMessage = cfErrorData?.message || error.message || "Internal Server Error";
    return NextResponse.json({ error: `Cashfree Error: ${errorMessage}` }, { status: 500 });
  }
}
