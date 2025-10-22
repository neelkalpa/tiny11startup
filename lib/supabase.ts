// This file is no longer needed as we moved to server-side API routes
// The Supabase operations are now handled in /app/api/license/route.ts
// to keep credentials secure on the server side.

export interface OAuthUser {
  email: string;
  license_key: string | null;
  expirydate: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PremiumUser {
  license_key: string;
  expirydate: string;
  created_at?: string;
  updated_at?: string;
}
