import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

// GET — fetch all products with their category slug
export async function GET() {
  try {
    const supabase = createAdminClient();
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

// POST — create a new product
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { name, price, stock, category, image, colors, age_category } = body;

    // Resolve category_id from category name
    let category_id = null;
    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category)
        .single();
      if (cat) category_id = cat.id;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        price: Number(price),
        stock_quantity: Number(stock),
        category_id,
        primary_image_url: image || null,
        brand: body.brand || null,
        description: body.description || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT — update a product
export async function PUT(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const { id, name, price, stock, category, image, colors, age_category } = body;

    // Resolve category_id
    let category_id = null;
    if (category) {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category)
        .single();
      if (cat) category_id = cat.id;
    }

    const updatePayload = {
      name,
      price: Number(price),
      stock_quantity: Number(stock),
      primary_image_url: image || null,
    };
    if (category_id) updatePayload.category_id = category_id;

    const { data, error } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ product: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — remove a product
export async function DELETE(req) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
