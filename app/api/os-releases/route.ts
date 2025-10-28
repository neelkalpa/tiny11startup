import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Fetching all OS releases...');
    
    const { data, error } = await supabase
      .from('os_release')
      .select('*')
      .order('release_date', { ascending: false });

    console.log('Supabase response for all releases:', { data, error });

    if (error) {
      console.log('Supabase error details:', error);
      return NextResponse.json({ error: 'Failed to fetch OS releases' }, { status: 500 });
    }

    return NextResponse.json({ releases: data });
  } catch (error) {
    console.log('Catch block error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
