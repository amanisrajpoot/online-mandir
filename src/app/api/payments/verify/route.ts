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
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    // Call Cashfree API to fetch order status
    const response = await cashfree.PGOrderFetchPayments(orderId);
    
    // Check if any payment was successful
    const isSuccess = response.data?.some((payment: any) => payment.payment_status === "SUCCESS");

    if (isSuccess) {
      // Update Supabase Order
      await supabase
        .from('orders')
        .update({ status: 'booked' }) // Move from pending to booked once paid
        .eq('cashfree_order_id', orderId);

      return NextResponse.json({ success: true, status: "SUCCESS" });
    } else {
      return NextResponse.json({ success: false, status: "FAILED" });
    }

  } catch (error: any) {
    console.error("Verify Payment API Error:", error?.response?.data || error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
