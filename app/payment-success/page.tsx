"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'duplicate'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        const route = searchParams.get('route');
        const downloadType = searchParams.get('downloadtype');
        const encryptedId = searchParams.get('id');
        const token = searchParams.get('token') || searchParams.get('PayerID');

        console.log('Payment success parameters:', { route, downloadType, encryptedId, token });

        if (!route || !downloadType || !encryptedId || !token) {
          setStatus('error');
          setMessage('Missing required parameters');
          return;
        }

        // Call the server-side API to process the payment
        const response = await fetch('/api/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route,
            downloadType,
            encryptedId,
            token,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage('Transaction successful! Starting download...');
          
          // Get the download type and route
          const downloadType = searchParams.get('downloadtype');
          const route = searchParams.get('route');
          
          // Auto-start download based on type
          if (downloadType === '1') {
            // Creator download
            window.open('/api/download-creator?route=' + route, '_blank');
          } else if (downloadType === '2') {
            // Installer download  
            window.open('/api/download-installer?route=' + route, '_blank');
          }
          
          // Redirect back to route page after a short delay
          setTimeout(() => {
            window.location.href = `/${route}`;
          }, 2000);
          
        } else if (data.status === 'duplicate') {
          setStatus('duplicate');
          setMessage('Transaction already processed');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to process payment');
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        setStatus('error');
        setMessage('An error occurred while processing your payment');
      }
    };

    processPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
              <p className="text-gray-600">Please wait while we process your transaction...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="text-sm text-gray-500">
                Redirecting back to download page...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <a
                href={`/${searchParams.get('route') || ''}`}
                className="btn-primary inline-block"
              >
                Return to Download
              </a>
            </>
          )}

          {status === 'duplicate' && (
            <>
              <XCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Transaction Already Processed</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <a
                href={`/${searchParams.get('route') || ''}`}
                className="btn-primary inline-block"
              >
                Return to Download
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
