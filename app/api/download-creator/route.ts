import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Function to get Supabase client (same as license API)
function getSupabaseClient() {
  // Try to get from environment variables first
  let supabaseUrl = process.env.SUPABASE_URL_TINY11;
  let supabaseServiceKey = process.env.SUPABASE_KEY_TINY11;

  // If not found in environment, use hardcoded values as fallback
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log("Environment variables not found, using fallback values");
    supabaseUrl = "https://slklnczznxssritvwudb.supabase.co";
    supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsa2xuY3p6bnhzc3JpdHZ3dWRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk0NzQ3OCwiZXhwIjoyMDcxNTIzNDc4fQ.FEutpV3BTilg2Da5QEFrgRqJ9XCthYAggjnsrawN98Y";
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const route = searchParams.get('route');

    if (!route) {
      return NextResponse.json({ error: 'Route is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();

    // Get the OS release data
    const { data: osRelease, error } = await supabase
      .from('os_release')
      .select('creator_link, name')
      .eq('route', route)
      .single();

    if (error || !osRelease) {
      return NextResponse.json({ error: 'OS release not found' }, { status: 404 });
    }

    // Return the download URL as JSON
    return NextResponse.json({ downloadUrl: osRelease.creator_link });

  } catch (error) {
    console.error('Download creator API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

