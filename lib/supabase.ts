import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL_TINY11
const supabaseKey = process.env.SUPABASE_KEY_TINY11

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// This client should only be used on the server side
export const supabase = createClient(supabaseUrl, supabaseKey)

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

export interface OSRelease {
  id: number;
  name: string;
  cpu: string;
  minimum_ram: number;
  recommended_ram: number | null;
  disk: number;
  other_req: string | null;
  price: number;
  release_date: string;
  youtube_link: string;
  route: string;
  creator_link: string;
  download_link: string;
}
