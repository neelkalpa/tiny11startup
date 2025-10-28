import { NextRequest, NextResponse } from 'next/server';

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11 || 'https://your-project.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY_TINY11 || 'your-anon-key';
  const { createClient } = require('@supabase/supabase-js');
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, licenseKey } = body || {};

    if (!email || !licenseKey) {
      return NextResponse.json({ error: 'Email and license key are required.' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Check if license key exists in premiumusers table and get expiry date
    const { data: keyData, error: keyError } = await supabase
      .from('premiumusers')
      .select('license_key, expirydate')
      .eq('license_key', licenseKey)
      .single();

    if (keyError && keyError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Invalid license key. Please double‑check and try again.' }, { status: 400 });
    }

    if (keyError) {
      console.error('Error checking license key:', keyError);
      return NextResponse.json({ error: 'Invalid license key. Please double‑check and try again.' }, { status: 400 });
    }

    // Check if license key is already in use by another user
    const { data: keyInUse, error: useError } = await supabase
      .from('oauth')
      .select('email')
      .eq('license_key', licenseKey)
      .neq('email', email)
      .single();

    if (useError && useError.code !== 'PGRST116') {
      console.error('Error checking key usage:', useError);
      return NextResponse.json({ error: 'We could not validate this license key at the moment. Please try again shortly.' }, { status: 500 });
    }

    if (keyInUse) {
      return NextResponse.json({ error: 'This license key is already associated with another account.' }, { status: 400 });
    }

    // Ensure user row exists, then update license_key only
    const { data: exists, error: existsError } = await supabase
      .from('oauth')
      .select('email')
      .eq('email', email)
      .single();

    if (existsError && existsError.code === 'PGRST116') {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    if (existsError) {
      console.error('Error checking user existence:', existsError);
      return NextResponse.json({ error: 'We couldn’t update your license key. Please try again.' }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from('oauth')
      .update({ 
        license_key: licenseKey,
        expirydate: keyData.expirydate
      })
      .eq('email', email);

    if (updateError) {
      console.error('Error updating license key:', updateError);
      return NextResponse.json({ error: 'Invalid license key. Please double‑check and try again.' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('update-license-key API error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
