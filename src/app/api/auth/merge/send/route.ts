import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { targetPhone } = await req.json()
    if (!targetPhone) {
      return NextResponse.json({ error: 'targetPhone is required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Verify session from the Authorization header (Bearer token)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Delete any previous OTPs for this user
    await supabaseAdmin
      .from('merge_otps')
      .delete()
      .eq('user_id', user.id)

    // Store OTP in DB
    const { error: insertError } = await supabaseAdmin
      .from('merge_otps')
      .insert({
        user_id: user.id,
        target_phone: targetPhone,
        otp: otp
      })

    if (insertError) {
      console.error("DB Insert Error:", insertError)
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })
    }

    // Send OTP via Fast2SMS
    const phoneNum = targetPhone.replace('+', '')
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": process.env.FAST2SMS_API_KEY || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        variables_values: otp,
        route: "otp",
        numbers: phoneNum
      })
    })

    const data = await response.json()
    
    if (!response.ok || data.return === false) {
      console.error("Fast2SMS API Error:", data)
      return NextResponse.json({ error: 'Failed to send SMS via Fast2SMS' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'OTP Sent successfully' })
  } catch (error: any) {
    console.error("Merge OTP Send Error:", error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
