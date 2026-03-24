"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { Star, Truck, Shield, ArrowLeft, Check, Plus, Minus, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function ProductDetailPage({ params }) {
  // Gracefully handle Next.js 15 params promise or Next.js 14 params object
  const idValue = params && typeof params.then === 'function' ? use(params).id : params?.id;
  const id = idValue ? decodeURIComponent(idValue) : null;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const { addToCart, buyNow } = useCart();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const supabase = createClient();
        
        let finalData = null;

        // Try fetch by slug first
        const { data: slugData, error: slugError } = await supabase
          .from('products')
          .select('*, categories(name, slug)')
          .eq('slug', String(id))
          .single();

        if (slugData && !slugError) {
          finalData = slugData;
        } else {
          // Fallback to fetch by id if it's a valid uuid pattern (this avoids Postgres 22P02 errors)
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
          if (isUuid) {
            const { data: idData, error: idError } = await supabase
              .from('products')
              .select('*, categories(name, slug)')
              .eq('id', String(id))
              .single();
            if (idData && !idError) {
              finalData = idData;
            }
          }
        }

        if (!finalData) {
          setErrorStatus('not_found');
        } else {
          const data = finalData;
          // Normalize the product output to match what the UI expects
          setProduct({
            id: data.id,
            slug: data.slug,
            name: data.name,
            brand: data.brand || 'Giriram',
            price: Number(data.price),
            compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : Number(data.price),
            description: data.description || 'A great product from Giriram Cycle Mart.',
            features: [
              'High quality materials',
              'Durable and long-lasting',
              'Easy to use',
              '1 Year Warranty'
            ],
            category: data.categories?.name || 'Accessories',
            stock_quantity: data.stock_quantity,
            images: [data.primary_image_url || 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80'],
            reviews: { count: 0, rating: 5.0 }
          });
        }
      } catch (err) {
        setErrorStatus('error');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (errorStatus === 'not_found' || !product) {
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

  // Calculate discount only if compare_at_price is greater than price. We use Math.max to prevent negative or NaN.
  const discount = product.compare_at_price && product.compare_at_price > product.price 
    ? Math.max(0, Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100))
    : 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    toast.success('Added to cart!');
    setTimeout(() => { setIsAdding(false); setQuantity(1); }, 600);
  };

  const handleBuyNow = () => {
    if (isBuying) return;
    setIsBuying(true);
    buyNow(product, quantity);
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
              {discount > 0 && (
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

              <button onClick={handleBuyNow} disabled={product.stock_quantity === 0 || isBuying} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', fontSize: '1.125rem', fontWeight: '700', borderRadius: '0.5rem', backgroundColor: 'var(--secondary)', color: 'white', cursor: (product.stock_quantity === 0 || isBuying) ? 'not-allowed' : 'pointer', opacity: (product.stock_quantity === 0 || isBuying) ? 0.5 : 1 }}>
                <Zap size={20} /> {isBuying ? 'Processing...' : 'Buy Now'}
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
