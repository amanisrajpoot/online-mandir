import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { targetPhone, otp } = await req.json()
    if (!targetPhone || !otp) {
      return NextResponse.json({ error: 'targetPhone and otp are required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Verify session
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Validate OTP from `merge_otps` table
    const { data: otpRecords, error: otpError } = await supabaseAdmin
      .from('merge_otps')
      .select('*')
      .eq('user_id', user.id)
      .eq('target_phone', targetPhone)
      .eq('otp', otp)
      .gte('created_at', new Date(Date.now() - 5 * 60000).toISOString()) // 5-minute expiry

    if (otpError || !otpRecords || otpRecords.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 })
    }

    // OTP is valid! Proceed with the merge.
    
    // Clean up OTP record
    await supabaseAdmin.from('merge_otps').delete().eq('id', otpRecords[0].id)

    // 2. Find User B (the account that currently owns the phone number)
    const { data: usersResponse, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) {
      console.error("List users error:", listError)
      return NextResponse.json({ error: 'Failed to list users' }, { status: 500 })
    }

    const cleanTargetPhone = targetPhone.replace('+', '')
    const userB = usersResponse.users.find(u => u.phone && u.phone.replace('+', '') === cleanTargetPhone)

    if (userB) {
      // 3. Migrate data from User B to User A
      console.log(`Migrating data from User B (${userB.id}) to User A (${user.id})`)
      
      // We will perform updates directly via supabaseAdmin
      // Note: Depending on your exact schema, add any other tables that reference user_id
      
      await supabaseAdmin.from('orders').update({ user_id: user.id }).eq('user_id', userB.id)
      // Add other tables here if needed (e.g. cart_items, user_addresses, etc)

      // 4. Delete from public tables FIRST to prevent Foreign Key constraints from blocking auth.users deletion
      console.log(`Deleting User B from public.users`)
      await supabaseAdmin.from('users').delete().eq('id', userB.id)

      console.log(`Deleting User B from auth.users (${userB.id})`)
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userB.id)
      if (deleteError) {
        console.error("Failed to delete old user:", deleteError.message || deleteError)
        return NextResponse.json({ error: `Failed to delete old account: ${deleteError.message || 'Unknown error'}` }, { status: 500 })
      }
    } else {
      console.log(`User B not found for phone: ${targetPhone}`)
    }

    // 5. Update User A with the new phone number
    const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      phone: targetPhone,
      phone_confirm: true
    })

    if (updateAuthError) {
      console.error("Failed to update User A's phone:", updateAuthError)
      return NextResponse.json({ error: 'Failed to update your phone number after merge' }, { status: 500 })
    }

    // 6. Update User A's record in public.users
    await supabaseAdmin.from('users').update({ phone: targetPhone }).eq('id', user.id)

    return NextResponse.json({ success: true, message: 'Accounts successfully merged!' })

  } catch (error: any) {
    console.error("Merge Verification Error:", error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
