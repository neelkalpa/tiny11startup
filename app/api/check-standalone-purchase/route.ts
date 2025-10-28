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
    const email = searchParams.get("email");
    const route = searchParams.get("route");

    console.log("Check standalone purchase API called with:", { email, route });

    if (!email || !route) {
      return NextResponse.json({ error: "Email and route are required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Supabase client not created");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    // Check if user has purchased this specific route
    const { data, error } = await supabase
      .from("standalone_purchases")
      .select("*")
      .eq("email", email)
      .eq("route", route)
      .single();

    console.log("Standalone purchase check result:", { data, error });

    if (error && error.code !== "PGRST116") {
      console.error("Error checking standalone purchase:", error);
      return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      hasPurchased: !!data,
      purchase: data 
    });

  } catch (error) {
    console.error("Check standalone purchase API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

