import { NextRequest, NextResponse } from 'next/server';
import { decryptEmail } from '@/lib/emailEncryption';
import { createClient } from '@supabase/supabase-js';

// Function to get Supabase client from environment variables
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL_TINY11;
  const supabaseServiceKey = process.env.SUPABASE_KEY_TINY11;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase configuration. Please set SUPABASE_URL_TINY11 and SUPABASE_KEY_TINY11.');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    const { route, downloadType, encryptedId, token, orderId } = await request.json();

    if (!route || !downloadType || !encryptedId || !token || !orderId) {
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
    console.log('Payment captured successfully:', captureResult);

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
      email = decryptEmail(encryptedId);
    } catch {
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
      console.error('PayPal transaction insert failed:', paypalError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process transaction',
        details: paypalError
      }, { status: 500 });
    }

    // Add to standalone_purchases table
    const { error: purchaseError } = await supabase
      .from('standalone_purchases')
      .insert({
        route: route,
        email: email,
      });

    if (purchaseError) {
      console.error('Standalone purchase insert failed:', purchaseError);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to record purchase',
        details: purchaseError
      }, { status: 500 });
    }
    
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
