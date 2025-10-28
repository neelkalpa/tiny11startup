"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function RouteSubscriptionSuccessContent() {
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
        const returnRoute = searchParams.get('returnRoute');

        console.log('Route subscription success parameters:', { subscriptionType, encryptedId, token, returnRoute });

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
          
          // Redirect back to the original route after a short delay
          setTimeout(() => {
            window.location.href = `/${returnRoute || ''}`;
          }, 3000);
        } else if (data.status === 'duplicate') {
          setStatus('duplicate');
          setMessage('Subscription already processed');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to process subscription');
        }
      } catch (error) {
        console.error('Route subscription processing error:', error);
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
              <div className="text-sm text-gray-500">
                Redirecting back to download page...
              </div>
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

export default function RouteSubscriptionSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <RouteSubscriptionSuccessContent />
    </Suspense>
  );
}

