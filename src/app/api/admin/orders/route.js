import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET — fetch all orders with items
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(product_name_at_time, quantity, price_at_time)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update order status
export async function PUT(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
