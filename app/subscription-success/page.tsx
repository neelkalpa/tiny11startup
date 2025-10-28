"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'duplicate'>('loading');
  const [message, setMessage] = useState('');
  const [expiryDate, setExpiryDate] = useState<string>('');

  useEffect(() => {
    const processSubscription = async () => {
      try {
        const subscriptionType = searchParams.get('subscriptionType');
        const encryptedId = searchParams.get('id');
        const token = searchParams.get('token') || searchParams.get('PayerID');

        console.log('Subscription success parameters:', { subscriptionType, encryptedId, token });

        if (!subscriptionType || !encryptedId || !token) {
          setStatus('error');
          setMessage('Missing required parameters');
          return;
        }

        // Call the server-side API to process the subscription
        const response = await fetch('/api/subscription-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionType,
            encryptedId,
            token,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Subscription activated successfully!');
          setExpiryDate(data.expiryDate);
        } else if (data.status === 'duplicate') {
          setStatus('duplicate');
          setMessage('Subscription already processed');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to process subscription');
        }
      } catch (error) {
        console.error('Subscription processing error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your subscription');
      }
    };

    processSubscription();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Subscription</h1>
              <p className="text-gray-600">Please wait while we activate your subscription...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              {expiryDate && (
                <p className="text-sm text-gray-500 mb-6">
                  Your subscription is active until: {new Date(expiryDate).toLocaleDateString()}
                </p>
              )}
              <Link
                href="/"
                className="btn-primary inline-block"
              >
                Return to Home
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Error</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/"
                className="btn-primary inline-block"
              >
                Return to Home
              </Link>
            </>
          )}

          {status === 'duplicate' && (
            <>
              <XCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscription Already Processed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/"
                className="btn-primary inline-block"
              >
                Return to Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}

