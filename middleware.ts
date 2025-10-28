import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/api/license(.*)',
  '/api/debug-env(.*)',
  '/api/test-supabase(.*)',
  '/api/paypal(.*)',
  '/api/payment-success(.*)',
  '/api/test-standalone-purchases(.*)',
  '/api/check-standalone-purchase(.*)',
  '/api/download-creator(.*)',
  '/api/download-installer(.*)',
  '/api/subscription-success(.*)',
  '/api/my-purchases(.*)',
  '/api/subscription-status(.*)',
  '/api/my-plan(.*)',
  '/api/update-license-key(.*)'
]);

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
