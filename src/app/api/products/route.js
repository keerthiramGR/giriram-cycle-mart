import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Public products endpoint — uses anon key, respects RLS (products are public)
export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name, slug)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ products: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
