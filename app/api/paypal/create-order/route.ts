import { NextRequest, NextResponse } from 'next/server';
import { encryptEmail } from '@/lib/emailEncryption';

export async function POST(request: NextRequest) {
  try {
    const { description, amount, downloadType, email, route } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Encrypt the email with padding
    const encryptedEmail = encryptEmail(email);

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

    // Create order
    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toString(),
          },
          description: description,
          custom_id: `${downloadType}_${Date.now()}`,
        },
      ],
      application_context: {
        brand_name: 'Tiny 11',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success?route=${route}&downloadtype=${downloadType === 'creator' ? '1' : '2'}&id=${encryptedEmail}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-cancelled`,
      },
    };

    const orderResponse = await fetch(
      mode === 'Live'
        ? 'https://api-m.paypal.com/v2/checkout/orders'
        : 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': `${downloadType}_${Date.now()}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error('PayPal order creation failed:', errorData);
      return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 });
    }

    const orderResult = await orderResponse.json();
    
    // Find approval URL
    const approvalLink = orderResult.links?.find((link: { rel: string; href: string }) => link.rel === 'approve');
    
    if (!approvalLink) {
      return NextResponse.json({ error: 'No approval URL found' }, { status: 500 });
    }

    return NextResponse.json({
      orderId: orderResult.id,
      approvalUrl: approvalLink.href,
    });

  } catch (error) {
    console.error('PayPal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
