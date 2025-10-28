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
    const { route, downloadType, encryptedId, token } = await request.json();

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
      email = decryptEmail(encryptedId);
    } catch (error) {
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
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to process transaction' 
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
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to record purchase' 
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
