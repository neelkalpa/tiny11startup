import { NextRequest, NextResponse } from 'next/server';
import { decryptEmail } from '@/lib/emailEncryption';
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

export async function POST(request: NextRequest) {
  try {
    const { route, downloadType, encryptedId, token } = await request.json();

    console.log('Payment success API called with:', { route, downloadType, encryptedId, token });

    if (!route || !downloadType || !encryptedId || !token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Get Supabase client
    const supabase = getSupabaseClient();

    // Check if transaction already exists
    const { data: existingTransaction } = await supabase
      .from('paypal_transactions')
      .select('id')
      .eq('id', encryptedId)
      .single();

    if (existingTransaction) {
      return NextResponse.json({ 
        success: false, 
        error: 'Transaction already processed',
        status: 'duplicate'
      }, { status: 200 });
    }

    // Decrypt the email
    let email: string;
    try {
      console.log('Attempting to decrypt:', encryptedId);
      email = decryptEmail(encryptedId);
      console.log('Decrypted email:', email);
    } catch (error) {
      console.error('Decryption error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid transaction ID' 
      }, { status: 400 });
    }

    // Add to paypal_transactions table
    const { error: paypalError } = await supabase
      .from('paypal_transactions')
      .insert({
        id: encryptedId,
        transaction_id: token,
        email: email,
      });

    if (paypalError) {
      console.error('Error adding to paypal_transactions:', paypalError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process transaction' 
      }, { status: 500 });
    }

    // Add to standalone_purchases table
    console.log('Adding to standalone_purchases:', { route, email });
    const { error: purchaseError } = await supabase
      .from('standalone_purchases')
      .insert({
        route: route,
        email: email,
      });

    if (purchaseError) {
      console.error('Error adding to standalone_purchases:', purchaseError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to record purchase' 
      }, { status: 500 });
    }

    console.log('Successfully added to standalone_purchases');

    console.log('Payment processing completed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transaction successful',
      email: email,
      route: route,
      downloadType: downloadType
    });

  } catch (error) {
    console.error('Payment success API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
