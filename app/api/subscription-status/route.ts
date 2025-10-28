import { NextRequest, NextResponse } from 'next/server';

// Local Supabase client for server-side use
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11 || 'https://your-project.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY_TINY11 || 'your-anon-key';
  
  const { createClient } = require('@supabase/supabase-js');
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

    // Get user's subscription status from oauth table
    const { data: userData, error: userError } = await supabase
      .from('oauth')
      .select('expirydate')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user subscription:', userError);
      return NextResponse.json({ error: 'Failed to fetch subscription status' }, { status: 500 });
    }

    const hasSubscription = userData?.expirydate && new Date(userData.expirydate) > new Date();
    const expiryDate = userData?.expirydate || null;

    return NextResponse.json({
      hasSubscription: !!hasSubscription,
      expiryDate: expiryDate
    });
  } catch (error) {
    console.error('Error in subscription-status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
