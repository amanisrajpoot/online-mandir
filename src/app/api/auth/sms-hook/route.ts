import { NextResponse } from 'next/server'

// Note: To secure this endpoint, you should configure Supabase webhook to send a secret header, e.g.,
// Authorization: Bearer <YOUR_WEBHOOK_SECRET>
// and verify it here.

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { user, sms } = payload
    
    if (!user || !user.phone || !sms || !sms.otp) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Fast2SMS expects 10-digit mobile number, or country code without '+'
    // Usually, Supabase phone numbers include the '+' prefix (e.g., +919876543210).
    const phone = user.phone.replace('+', '') 
    const otp = sms.otp
    
    // Call Fast2SMS API
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: phone
      })
    })

    const data = await response.json()
    
    if (!response.ok || data.return === false) {
      console.error("Fast2SMS API Error:", data)
      return NextResponse.json({ error: 'Failed to send SMS via Fast2SMS' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Webhook Error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
