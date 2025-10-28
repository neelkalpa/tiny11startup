import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Function to get Supabase client
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

  console.log("Using Supabase URL:", supabaseUrl);
  console.log("Using Supabase Key:", supabaseServiceKey ? "PRESENT" : "MISSING");

  return createClient(supabaseUrl, supabaseServiceKey);
}

// Helper function to normalize license key (remove dashes and spaces)
function normalizeLicenseKey(key: string): string {
  return key.replace(/[-\s]/g, "").toLowerCase();
}

// Helper function to format normalized key back to standard format
function formatLicenseKey(normalizedKey: string): string | null {
  if (normalizedKey.length === 32) {
    // UUID format: 8-4-4-4-12
    return `${normalizedKey.slice(0, 8)}-${normalizedKey.slice(
      8,
      12
    )}-${normalizedKey.slice(12, 16)}-${normalizedKey.slice(
      16,
      20
    )}-${normalizedKey.slice(20, 32)}`;
  } else if (normalizedKey.length === 40) {
    // Custom format: 5-5-5-5-5-5-5-5
    return `${normalizedKey.slice(0, 5)}-${normalizedKey.slice(
      5,
      10
    )}-${normalizedKey.slice(10, 15)}-${normalizedKey.slice(
      15,
      20
    )}-${normalizedKey.slice(20, 25)}-${normalizedKey.slice(
      25,
      30
    )}-${normalizedKey.slice(30, 35)}-${normalizedKey.slice(35, 40)}`;
  }
  return null; // Invalid length
}

// Check if user exists in oauth table
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const action = searchParams.get("action");

    console.log("License API called with:", { email, action });

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Supabase client not created");
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    if (action === "checkUser") {
      console.log("Checking user in oauth table for email:", email);
      const { data, error } = await supabase
        .from("oauth")
        .select("*")
        .eq("email", email)
        .single();

      console.log("Supabase response:", { data, error });

      if (error && error.code !== "PGRST116") {
        console.error("Error checking existing user:", error);
        return NextResponse.json({ error: "Database error", details: error.message }, { status: 500 });
      }

      return NextResponse.json({ exists: !!data, user: data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("License API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Validate license key and process user data
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const body = await request.json();
    const { action, email, licenseKey } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (action === "validateLicense") {
      if (!licenseKey) {
        return NextResponse.json(
          { error: "License key is required" },
          { status: 400 }
        );
      }

      // Normalize the input (remove dashes and spaces)
      const normalizedKey = normalizeLicenseKey(licenseKey);

      console.log("Original license key:", licenseKey);
      console.log("Normalized license key:", normalizedKey);
      console.log("Normalized key length:", normalizedKey.length);

      // Format the normalized key to standard format
      const formattedKey = formatLicenseKey(normalizedKey);

      if (!formattedKey) {
        return NextResponse.json({
          valid: false,
          error: "Invalid license key",
        });
      }

      console.log("Formatted license key:", formattedKey);

      // Validate license key in premiumusers table using the formatted key
      const { data: premiumUser, error: premiumError } = await supabase
        .from("premiumusers")
        .select("*")
        .eq("license_key", formattedKey)
        .single();

      console.log("Premium user found:", premiumUser);
      console.log("Premium user error:", premiumError);

      if (premiumError && premiumError.code !== "PGRST116") {
        console.error("Error validating license key:", premiumError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      if (!premiumUser) {
        // Let's also check what license keys exist in the table for debugging
        const { data: allKeys, error: allKeysError } = await supabase
          .from("premiumusers")
          .select("license_key")
          .limit(5);

        console.log("Sample license keys in database:", allKeys);
        console.log("All keys error:", allKeysError);

        return NextResponse.json({
          valid: false,
          error: "Invalid license key",
        });
      }

      // Check if license is still valid (not expired)
      const now = new Date();
      const expiryDate = new Date(premiumUser.expirydate);

      if (expiryDate <= now) {
        return NextResponse.json({ valid: false, error: "License expired" });
      }

      // Check if this license key is already used in oauth table
      const { data: existingOAuthUser, error: oauthCheckError } = await supabase
        .from("oauth")
        .select("*")
        .eq("license_key", formattedKey)
        .single();

      console.log("OAuth check - existing user:", existingOAuthUser);
      console.log("OAuth check - error:", oauthCheckError);

      if (oauthCheckError && oauthCheckError.code !== "PGRST116") {
        console.error("Error checking oauth user:", oauthCheckError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      if (existingOAuthUser) {
        console.log(
          "License key already exists in oauth - returning already activated error"
        );
        // License key already exists in oauth table - belongs to another account
        return NextResponse.json({
          valid: false,
          error:
            "This license key has already been activated on another account. If this is your key and you're unable to access it, or if you believe it was wrongfully activated, please contact support@tiny11.ch for assistance.",
        });
      }

      // Add user to oauth table with license info (store the formatted key to match premiumusers)
      const { data: oauthUser, error: oauthError } = await supabase
        .from("oauth")
        .upsert(
          {
            email,
            license_key: formattedKey, // Store the formatted key to match premiumusers foreign key
            expirydate: premiumUser.expirydate,
          },
          {
            onConflict: "email",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single();

      if (oauthError) {
        console.error("Error upserting oauth user:", oauthError);

        // Check if it's a unique constraint violation (license key already used)
        if (oauthError.code === "23505") {
          return NextResponse.json({
            valid: false,
            error:
              "This license key has already been activated on another account. If this is your key and you're unable to access it, or if you believe it was wrongfully activated, please contact support@tiny11.ch for assistance.",
          });
        }

        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      return NextResponse.json({ valid: true, user: oauthUser });
    }

    if (action === "skipLicense") {
      // Add user to oauth table without license info
      const { data: oauthUser, error: oauthError } = await supabase
        .from("oauth")
        .upsert(
          {
            email,
            license_key: null,
            expirydate: null,
          },
          {
            onConflict: "email",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single();

      if (oauthError) {
        console.error("Error upserting oauth user:", oauthError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      return NextResponse.json({ success: true, user: oauthUser });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
