import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route: string }> }
) {
  try {
    const { route } = await params;
    console.log('Looking for route:', route);
    
    const { data, error } = await supabase
      .from('os_release')
      .select('*')
      .eq('route', route)
      .single();

    console.log('Supabase response:', { data, error });

    if (error) {
      console.log('Supabase error details:', error);
      return NextResponse.json({ error: 'OS release not found' }, { status: 404 });
    }

    return NextResponse.json({ release: data });
  } catch (error) {
    console.log('Catch block error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
