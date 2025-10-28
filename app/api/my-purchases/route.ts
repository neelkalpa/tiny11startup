import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Local Supabase client for server-side use
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11 || 'https://your-project.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY_TINY11 || 'your-anon-key';
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    console.log('My-purchases API called with email:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Get user's standalone purchases
    console.log('Fetching purchases from standalone_purchases table...');
    console.log('Querying with email:', email);
    
    const { data: purchases, error: purchasesError } = await supabase
      .from('standalone_purchases')
      .select('id, route, email')
      .eq('email', email);

    console.log('Purchases query result:', { 
      purchases, 
      purchasesError,
      purchasesCount: purchases?.length || 0 
    });

    if (purchasesError) {
      console.error('Error fetching purchases:', purchasesError);
      return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
    }

    if (!purchases || purchases.length === 0) {
      console.log('No purchases found for email:', email);
      return NextResponse.json({ releases: [] });
    }

    // Get the OS release details for each purchased route
    const routes = purchases.map(p => p.route);
    console.log('Fetching release details for routes:', routes);
    
    const { data: releases, error: releasesError } = await supabase
      .from('os_release')
      .select('*')
      .in('route', routes)
      .order('release_date', { ascending: false });

    console.log('Releases query result:', { releases, releasesError });

    if (releasesError) {
      console.error('Error fetching releases:', releasesError);
      return NextResponse.json({ error: 'Failed to fetch release details' }, { status: 500 });
    }

    return NextResponse.json({ releases: releases || [] });
  } catch (error) {
    console.error('Error in my-purchases API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
