import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Format phone: remove +, spaces etc for the SMS API if needed, but for DB keep it standard
    const formattedPhone = phone.startsWith('+91') ? phone : (phone.length === 10 ? `+91${phone}` : phone);
    const smsPhone = formattedPhone.replace('+91', '');

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in Supabase
    const supabaseAdmin = await createClient(); // assuming server client uses service_role or we can just use the normal client for this public table
    // Wait, createClient from server uses cookies. Let's use service role directly to bypass RLS.
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const adminAuthClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: dbError } = await adminAuthClient
      .from('otp_verifications')
      .insert({
        phone: formattedPhone,
        otp: otp
      });

    if (dbError) {
      console.error("DB Error storing OTP:", dbError);
      return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 });
    }

    // Send SMS via Fast2SMS using cheaper DLT OTP route
    const fast2smsUrl = 'https://www.fast2sms.com/dev/bulkV2';
    
    const smsRes = await fetch(fast2smsUrl, {
      method: 'POST',
      headers: {
        'authorization': process.env.FAST2SMS_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: smsPhone
      })
    });
    
    const smsData = await smsRes.json();

    if (!smsData.return) {
      console.error("Fast2SMS Error:", smsData);

      // Fallback: If development OR wallet balance issue, log to console and allow to proceed
      if (process.env.NODE_ENV === 'development' || smsData.status_code === 999) {
        console.log(`\n================================`);
        console.log(`🔑 DEV/FALLBACK OTP FOR ${formattedPhone}: ${otp}`);
        console.log(`================================\n`);
        return NextResponse.json({ success: true, message: "OTP logged to console (Fallback mode)" });
      }

      return NextResponse.json({ error: "Failed to send SMS via Fast2SMS" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
