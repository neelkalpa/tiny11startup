import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Local Supabase client for server-side use
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11 || 'https://your-project.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY_TINY11 || 'your-anon-key';
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Test 1: Check if table exists and get all data
    console.log('Testing standalone_purchases table...');
    const { data: allPurchases, error: allError } = await supabase
      .from('standalone_purchases')
      .select('*')
      .limit(10);

    console.log('All purchases test:', { allPurchases, allError });

    // Test 2: Check table structure
    const { data: structure, error: structureError } = await supabase
      .from('standalone_purchases')
      .select('*')
      .limit(1);

    console.log('Table structure test:', { structure, structureError });

    // Test 3: Try to get count
    const { count, error: countError } = await supabase
      .from('standalone_purchases')
      .select('*', { count: 'exact', head: true });

    console.log('Count test:', { count, countError });

    return NextResponse.json({
      success: true,
      allPurchases: allPurchases || [],
      allError: allError?.message || null,
      structure: structure || [],
      structureError: structureError?.message || null,
      count: count || 0,
      countError: countError?.message || null
    });
  } catch (error) {
    console.error('Error in test-standalone-purchases API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}