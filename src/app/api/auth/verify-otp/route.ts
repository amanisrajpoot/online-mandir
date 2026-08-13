import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required" }, { status: 400 });
    }

    const formattedPhone = phone.startsWith('+91') ? phone : (phone.length === 10 ? `+91${phone}` : phone);

    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify OTP in DB
    const { data: otpRecords, error: dbError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('otp', otp)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (dbError || !otpRecords || otpRecords.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP is valid. Delete it so it can't be reused.
    await supabaseAdmin.from('otp_verifications').delete().eq('id', otpRecords[0].id);

    // Now, find or create the user and set a temporary password for sign in
    let userId;

    // Check if user exists using admin API to bypass PostgREST schema restrictions
    const searchPhone = formattedPhone.replace('+', '');
    const searchPhoneWithoutCountry = searchPhone.startsWith('91') ? searchPhone.substring(2) : searchPhone;
    
    // Fetch users via admin API (handles up to 50 users per page, sufficient for small/medium apps or admin search)
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    let authUser = null;
    if (!usersError && usersData?.users) {
      authUser = usersData.users.find(u => 
        u.phone === formattedPhone || 
        u.phone === searchPhone || 
        u.phone === searchPhoneWithoutCountry ||
        u.phone === `+91${searchPhoneWithoutCountry}`
      );
    }

    if (authUser) {
      userId = authUser.id;
    } else {
      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        phone: formattedPhone,
        phone_confirm: true,
      });

      if (createError || !newUser?.user) {
        console.error("Create User Error:", createError);
        return NextResponse.json({ error: "Failed to create user account" }, { status: 500 });
      }
      userId = newUser.user.id;
    }

    // Set a temporary password so the client can sign in
    const tempPassword = crypto.randomUUID();
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: tempPassword
    });

    if (updateError) {
      console.error("Update User Error:", updateError);
      return NextResponse.json({ error: "Failed to authenticate user" }, { status: 500 });
    }

    return NextResponse.json({ success: true, tempPassword, phone: formattedPhone });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
