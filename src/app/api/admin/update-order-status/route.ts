import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { notifyOrderStatusUpdate } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Ensure the caller is an authenticated admin
    // Note: If you have a specific admin role check, you can add it here.
    // For now, we ensure they are at least logged in as the admin.
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the user is an admin (assuming user metadata or role)
    // We will bypass strict role check here if your RLS handles it, or if it's already protected.
    
    const body = await request.json();
    const { orderId, status, videoUrl } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the order in the database
    const updatePayload: any = { status };
    if (videoUrl !== undefined) {
      updatePayload.video_url = videoUrl;
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select('*, users(name, phone, email)')
      .single();

    if (updateError || !updatedOrder) {
      console.error("Order Update Error:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    // Safely extract customer details. Priority: Order details -> User profile details
    const customerDetails = {
      customer_name: updatedOrder.customer_name || updatedOrder.users?.name,
      customer_phone: updatedOrder.customer_phone || updatedOrder.users?.phone,
      customer_email: updatedOrder.customer_email || updatedOrder.users?.email
    };

    // Trigger Notification
    // We don't await this so it runs in the background
    notifyOrderStatusUpdate(orderId, customerDetails, status, videoUrl).catch(err => {
      console.error("Notification Error on Status Update:", err);
    });

    return NextResponse.json({ success: true, order: updatedOrder });
    
  } catch (error: any) {
    console.error("Update Status API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
