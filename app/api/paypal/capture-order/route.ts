import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Determine PayPal credentials based on MODE
    const mode = process.env.MODE || 'Sandbox';
    const clientId = mode === 'Live' 
      ? process.env.PAYPAL_CLIENT_ID 
      : process.env.PAYPAL_CLIENT_ID_SANDBOX;
    const clientSecret = mode === 'Live'
      ? process.env.PAYPAL_CLIENT_SECRET
      : process.env.PAYPAL_CLIENT_SECRET_SANDBOX;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'PayPal credentials not configured' }, { status: 500 });
    }

    // Get access token
    const tokenResponse = await fetch(
      mode === 'Live' 
        ? 'https://api-m.paypal.com/v1/oauth2/token'
        : 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      }
    );

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: 'Failed to get PayPal access token' }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Capture the order
    const captureResponse = await fetch(
      mode === 'Live'
        ? `https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`
        : `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `capture_${orderId}_${Date.now()}`,
        },
        body: JSON.stringify({}),
      }
    );

    if (!captureResponse.ok) {
      const errorData = await captureResponse.json();
      console.error('PayPal capture failed:', errorData);
      return NextResponse.json({ 
        error: 'Failed to capture PayPal payment', 
        details: errorData 
      }, { status: 500 });
    }

    const captureResult = await captureResponse.json();
    
    return NextResponse.json({
      success: true,
      captureId: captureResult.id,
      status: captureResult.status,
      amount: captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.amount,
      transactionId: captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id,
    });

  } catch (error) {
    console.error('PayPal capture API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
