import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

// POST — save a new order with items (guest checkout supported)
export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      cartItems,
      totalAmount,
      shippingCost,
      razorpayPaymentId,
      razorpayOrderId
    } = body;

    const orderRef = 'ORD-' + Math.floor(10000 + Math.random() * 90000);

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        status: razorpayPaymentId ? 'processing' : 'pending', // Auto-approve paid Razorpay orders
        order_ref: orderRef,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    if (cartItems && cartItems.length > 0) {
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name_at_time: item.name,
        quantity: item.quantity,
        price_at_time: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
    }

    return NextResponse.json({ orderId: order.id, orderRef }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
