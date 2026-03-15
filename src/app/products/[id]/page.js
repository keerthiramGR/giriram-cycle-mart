"use client";

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { Star, Truck, Shield, ArrowLeft, Check, Plus, Minus, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const DUMMY_PRODUCTS = {
  'hercules-roadeo': {
    id: 1, slug: 'hercules-roadeo', name: 'Hercules Roadeo Hannibal 27.5T', brand: 'Hercules', price: 14500, compare_at_price: 16000,
    description: 'The Hercules Roadeo Hannibal is a premium 27.5T mountain bike designed for thrill-seekers. Featuring a sturdy alloy frame, 21-speed Shimano gears, and dual disc brakes.',
    features: ['21-Speed Shimano Tourney Gearing', 'Dual Disc Brakes', 'Lightweight Alloy Frame', 'Front suspension fork with 60mm travel', '27.5" wide nylon tires'],
    category: 'Adult Cycles', stock_quantity: 5,
    images: ['https://images.unsplash.com/photo-1576435728678-68ce0f6eb293?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 124, rating: 4.8 }
  },
  'hero-kyoto': {
    id: 2, slug: 'hero-kyoto', name: 'Hero Kyoto 26T Single Speed', brand: 'Hero', price: 6499, compare_at_price: 7999,
    description: 'A perfect bicycle for daily commuting. Single speed, easy to maintain, and highly durable.',
    features: ['Single Speed', 'V-Brakes', 'Steel Frame', 'Anti-skid pedals'],
    category: 'Mountain Bikes', stock_quantity: 12,
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 89, rating: 4.2 }
  },
  'kids-electric-jeep': {
    id: 3, slug: 'kids-electric-jeep', name: 'Kids 12V Battery Operated Jeep', brand: 'ToyHouse', price: 18999, compare_at_price: 22000,
    description: 'An exciting battery-powered ride-on jeep for kids. Features realistic design, working headlights, and a powerful 12V motor for hours of outdoor fun.',
    features: ['12V Battery Powered', 'Working LED Headlights', 'MP3/USB Input', 'Parental Remote Control', 'Max Weight 30kg'],
    category: 'Kids Ride-on Vehicles', stock_quantity: 3,
    images: ['https://images.unsplash.com/photo-1596461404969-9ce20c71c4c1?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 56, rating: 4.5 }
  },
  'smart-helmet': {
    id: 4, slug: 'smart-helmet', name: 'Lumos Matrix Smart Helmet', brand: 'Lumos', price: 8999, compare_at_price: 9999,
    description: 'The world\u2019s first smart helmet with integrated LED lights and turn signals. Stay visible and safe on your rides with customizable light patterns.',
    features: ['Integrated LED Matrix', 'Turn Signals via Remote', 'MIPS Safety System', 'USB-C Rechargeable', 'iOS & Android App'],
    category: 'Accessories', stock_quantity: 20,
    images: ['https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 210, rating: 4.7 }
  },
  'hero-sprint': {
    id: 5, slug: 'hero-sprint', name: 'Hero Sprint Pro 27.5T', brand: 'Hero', price: 11200, compare_at_price: 13500,
    description: 'A versatile multi-speed mountain bike for enthusiasts. Features Shimano gears, front suspension, and durable double-wall alloy rims.',
    features: ['21-Speed Shimano Gears', 'Front Suspension', 'Double-Wall Alloy Rims', 'Disc Brakes', 'Quick Release Wheels'],
    category: 'Adult Cycles', stock_quantity: 0,
    images: ['https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 67, rating: 4.0 }
  },
  'emotorad-x1': {
    id: 6, slug: 'emotorad-x1', name: 'EMotorad X1 Electric Cycle', brand: 'EMotorad', price: 24999, compare_at_price: 28000,
    description: 'India\u2019s most popular electric bicycle. With a 250W motor, 25km/h top speed, and 30km+ range, commute effortlessly while staying eco-friendly.',
    features: ['250W Brushless Motor', '7.65Ah Lithium Battery', '30km+ Range', '7-Speed Shimano Gears', 'LED Display & Controls'],
    category: 'Electric Cycles', stock_quantity: 4,
    images: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80'],
    reviews: { count: 143, rating: 4.6 }
  },
};

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const product = DUMMY_PRODUCTS[id];

  const { addToCart } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1rem' }}>Product Not Found</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The product you are looking for does not exist.</p>
          <Link href="/products"><Button>Back to Products</Button></Link>
        </div>
      </div>
    );
  }

  const discount = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success('Added to cart!');
    setTimeout(() => { setIsAdding(false); setQuantity(1); }, 600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/products" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Products
          </Link>
        </div>

        <div className="product-detail">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <img src={product.images[activeImage]} alt={product.name} />
            </div>
            {product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <button key={idx} className={`thumbnail ${activeImage === idx ? 'active' : ''}`} onClick={() => setActiveImage(idx)}>
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.05em' }}>{product.brand}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>• {product.category}</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1.2', marginBottom: '1rem' }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', color: '#FBBF24' }}>
                {[1,2,3,4,5].map(star => (
                  <Star key={star} size={18} fill={star <= Math.round(product.reviews.rating) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                {product.reviews.rating} ({product.reviews.count} reviews)
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{product.price.toLocaleString('en-IN')}</span>
              {product.compare_at_price > product.price && (
                <>
                  <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.compare_at_price.toLocaleString('en-IN')}</span>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '0.875rem' }}>{discount}% OFF</span>
                </>
              )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Description</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>{product.description}</p>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Key Features</h3>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {product.features.map((feature, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', color: 'var(--text-muted)' }}>
                    <Check size={18} style={{ color: 'var(--success)', marginRight: '0.75rem', marginTop: '0.125rem', flexShrink: 0 }} />
                    <span style={{ lineHeight: '1.5' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--secondary)' }}>Quantity</span>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1} style={{ padding: '0.5rem', color: 'var(--text-muted)', borderRight: '1px solid var(--border-color)' }}><Minus size={18} /></button>
                  <span style={{ width: '3rem', textAlign: 'center', fontWeight: '600' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} disabled={quantity >= product.stock_quantity} style={{ padding: '0.5rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-color)' }}><Plus size={18} /></button>
                </div>
              </div>

              <Button size="lg" className="btn-full" onClick={handleAddToCart} disabled={product.stock_quantity === 0 || isAdding} style={{ fontSize: '1.125rem', padding: '1rem', marginBottom: '0.75rem' }}>
                {isAdding ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>

              <button onClick={handleBuyNow} disabled={product.stock_quantity === 0} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.125rem', fontWeight: '700', borderRadius: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', cursor: product.stock_quantity === 0 ? 'not-allowed' : 'pointer', opacity: product.stock_quantity === 0 ? 0.5 : 1 }}>
                <Zap size={20} /> Buy Now
              </button>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div style={{ backgroundColor: 'var(--white)', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}><Truck size={18} style={{ color: 'var(--primary)' }} /></div>
                  <span style={{ fontWeight: '500' }}>Free Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <div style={{ backgroundColor: 'var(--white)', padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)' }}><Shield size={18} style={{ color: 'var(--primary)' }} /></div>
                  <span style={{ fontWeight: '500' }}>1 Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
