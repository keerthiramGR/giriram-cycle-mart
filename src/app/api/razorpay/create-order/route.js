import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req) {
  try {
    const { amount } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay keys are missing from environment variables' }, { status: 500 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay requires amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Razorpay Order Error:', err);
    return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 });
  }
}
