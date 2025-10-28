import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11 || 'https://your-project.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY_TINY11 || 'your-anon-key';
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('oauth')
      .select('expirydate, license_key')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching plan:', error);
      return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
    }

    return NextResponse.json({ expirydate: data?.expirydate ?? null, license_key: data?.license_key ?? null });
  } catch (e) {
    console.error('my-plan API error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
