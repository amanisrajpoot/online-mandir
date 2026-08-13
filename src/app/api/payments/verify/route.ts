import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cashfree } from "@/lib/cashfree";
import { notifyOrderSuccess } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const body = await request.json();
    const { orderId, type } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Call Cashfree API to fetch order status
    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    // Check if any payment was successful
    const isSuccess = response.data?.some((payment: any) => payment.payment_status === "SUCCESS");

    if (isSuccess) {
      const table = type === 'donation' ? 'donation_orders' : 'orders';
      
      // Update Supabase Order
      const { data: updatedOrder, error: updateError } = await supabaseAdmin
        .from(table)
        .update({ status: 'booked' }) // Move from pending to booked once paid
        .eq('cashfree_order_id', orderId)
        .select('*')
        .single();

      if (updatedOrder) {
        // Fetch email from Auth if user_id exists
        let authEmail = null;
        if (updatedOrder.user_id) {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(updatedOrder.user_id);
          authEmail = userData.user?.email || null;
        } else if (type === 'donation' && updatedOrder.donor_message?.includes('| EMAIL:')) {
          authEmail = updatedOrder.donor_message.split('| EMAIL:')[1].trim();
        }

        // Prepare notification details based on table type
        const notifyDetails = type === 'donation' 
          ? {
              customer_name: updatedOrder.donor_name || 'Donor',
              customer_phone: updatedOrder.customer_phone,
              customer_email: authEmail
            }
          : {
              customer_name: updatedOrder.customer_name,
              customer_phone: updatedOrder.customer_phone,
              customer_email: authEmail
            };

        // Trigger Email & SMS Notifications in the background
        notifyOrderSuccess(
          updatedOrder.id,
          notifyDetails,
          updatedOrder.amount
        ).catch(err => console.error("Notification Error:", err));

        return NextResponse.json({ 
          success: true, 
          status: "SUCCESS",
          emailSent: !!authEmail,
          smsSent: !!updatedOrder.customer_phone && updatedOrder.amount > 51
        });
      }

      return NextResponse.json({ success: true, status: "SUCCESS" });
    } else {
      return NextResponse.json({ success: false, status: "FAILED" });
    }

  } catch (error: any) {
    console.error("Verify Payment API Error:", error?.response?.data || error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
