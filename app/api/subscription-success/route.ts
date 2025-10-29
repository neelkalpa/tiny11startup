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
    const { subscriptionType, encryptedId, token, orderId } = await request.json();

    console.log('Subscription success API called with:', { subscriptionType, encryptedId, token, orderId });

    if (!subscriptionType || !encryptedId || !token || !orderId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // First, capture the PayPal payment
    const captureResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!captureResponse.ok) {
      const captureError = await captureResponse.json();
      console.error('PayPal capture failed:', captureError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to capture payment',
        details: captureError
      }, { status: 500 });
    }

    const captureResult = await captureResponse.json();
    console.log('Subscription payment captured successfully:', captureResult);

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

    // Add to paypal_transactions table with capture details
    const { error: paypalError } = await supabase
      .from('paypal_transactions')
      .insert({
        id: encryptedId,
        transaction_id: captureResult.transactionId || token,
        email: email,
      });

    if (paypalError) {
      console.error('Error adding to paypal_transactions:', paypalError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process transaction' 
      }, { status: 500 });
    }

    // Calculate new expiry date based on subscription type
    let newExpiryDate: string;
    const now = new Date();

    if (subscriptionType === '48' || subscriptionType === '240') {
      // For $48 and $240 packs: add 1 year to current date or from now if NULL/past
      newExpiryDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();
    } else if (subscriptionType === '399') {
      // For $399 pack: set to January 1, 2100
      newExpiryDate = new Date('2100-01-01').toISOString();
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid subscription type' 
      }, { status: 400 });
    }

    // Check if user exists in oauth table
    const { data: existingUser } = await supabase
      .from('oauth')
      .select('expirydate')
      .eq('email', email)
      .single();

    let finalExpiryDate = newExpiryDate;

    if (existingUser && existingUser.expirydate) {
      const currentExpiry = new Date(existingUser.expirydate);
      const now = new Date();
      
      if (currentExpiry > now) {
        // If current expiry is in the future, add 1 year to it
        if (subscriptionType === '48' || subscriptionType === '240') {
          finalExpiryDate = new Date(currentExpiry.getFullYear() + 1, currentExpiry.getMonth(), currentExpiry.getDate()).toISOString();
        }
        // For $399, always set to 2100 regardless of current expiry
      }
    }

    // Update or insert user in oauth table
    const { error: oauthError } = await supabase
      .from('oauth')
      .upsert({
        email: email,
        expirydate: finalExpiryDate,
      });

    if (oauthError) {
      console.error('Error updating oauth table:', oauthError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update subscription' 
      }, { status: 500 });
    }

    console.log('Subscription processing completed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Subscription activated successfully',
      email: email,
      subscriptionType: subscriptionType,
      expiryDate: finalExpiryDate
    });

  } catch (error) {
    console.error('Subscription success API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
