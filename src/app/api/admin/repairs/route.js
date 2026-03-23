import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// GET — fetch all repair bookings
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('repair_bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ repairs: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update repair status and/or cost
export async function PUT(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, status, estimated_cost } = body;

    const updatePayload = {};
    if (status !== undefined) updatePayload.status = status;
    if (estimated_cost !== undefined) updatePayload.estimated_cost = Number(estimated_cost) || null;

    const { data, error } = await supabase
      .from('repair_bookings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ repair: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
