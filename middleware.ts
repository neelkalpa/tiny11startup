import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/api/license',
    '/api/debug-env',
    '/api/test-supabase',
    '/api/paypal',
    '/api/payment-success',
    '/api/test-standalone-purchases',
    '/api/check-standalone-purchase',
    '/api/download-creator',
    '/api/download-installer',
    '/api/subscription-success',
    '/api/my-purchases',
    '/api/subscription-status',
    '/api/test-standalone-purchases',
    '/api/my-plan',
    '/api/update-license-key'
  ];
  
  // Check if current path is public
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));
  
  // If not public, protect the route
  if (!isPublic) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
