"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = [
  { id: 'all', name: 'All Cycles' },
  { id: 'adult-cycles', name: 'Adult Cycles' },
  { id: 'kids-cycles', name: 'Kids Cycles' },
  { id: 'electric-cycles', name: 'Electric Cycles' },
  { id: 'mountain-bikes', name: 'Mountain Bikes' },
  { id: 'ride-on', name: 'Kids Ride-on Vehicles' },
  { id: 'kids-ride-on', name: 'Kids Ride-on (Alt)' },
  { id: 'accessories', name: 'Accessories' },
];

const DISPLAY_CATEGORIES = [
  { id: 'all', name: 'All Cycles' },
  { id: 'adult-cycles', name: 'Adult Cycles' },
  { id: 'kids-cycles', name: 'Kids Cycles' },
  { id: 'electric-cycles', name: 'Electric Cycles' },
  { id: 'mountain-bikes', name: 'Mountain Bikes' },
  { id: 'ride-on', name: 'Kids Ride-on Vehicles' },
  { id: 'accessories', name: 'Accessories' },
];

const PRICE_RANGES = [
  { id: 'all', name: 'All Prices' },
  { id: 'under-5000', name: 'Under ₹5,000', min: 0, max: 4999 },
  { id: '5000-10000', name: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: '10000-20000', name: '₹10,000 - ₹20,000', min: 10001, max: 20000 },
  { id: 'above-20000', name: 'Above ₹20,000', min: 20001, max: 1000000 },
];

// Map a DB product to the shape ProductCard expects
function mapProduct(p) {
  const catSlug = p.categories?.slug || 'accessories';
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand || '',
    price: Number(p.price),
    compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : null,
    category_slug: catSlug,
    stock_quantity: p.stock_quantity,
    primary_image_url: p.primary_image_url || '/images/products/placeholder.png',
    colors: p.colors ? p.colors.split(',').map(c => c.trim()) : [],
    age_category: p.age_category || '',
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [activePrice, setActivePrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setProducts((json.products || []).map(mapProduct));
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    // Match both 'ride-on' and 'kids-ride-on' slugs to the same filter
    const catMatch = activeCategory === 'all'
      || product.category_slug === activeCategory
      || (activeCategory === 'ride-on' && product.category_slug === 'kids-ride-on');
    if (!catMatch) return false;

    if (activePrice !== 'all') {
      const range = PRICE_RANGES.find(r => r.id === activePrice);
      if (product.price < range.min || product.price > range.max) return false;
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(lowerQuery) &&
          !(product.brand || '').toLowerCase().includes(lowerQuery)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Shop Cycles &amp; Accessories</h1>
          <p className="page-subtitle">Find the perfect ride for your next adventure.</p>
        </div>

        {/* Mobile Filter Toggle */}
        <button className="mobile-filter-btn" onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
          <SlidersHorizontal size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
          Filters &amp; Sorting
        </button>

        <div className="products-layout">
          {/* Sidebar */}
          <div className={`products-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
            <div className="filter-group">
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}
                />
                <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-title">Categories</h3>
              <ul className="filter-list">
                {DISPLAY_CATEGORIES.map(category => (
                  <li key={category.id}>
                    <button className={activeCategory === category.id ? 'active' : ''} onClick={() => setActiveCategory(category.id)}>
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <h3 className="filter-title">Price Range</h3>
              <ul className="filter-list">
                {PRICE_RANGES.map(range => (
                  <li key={range.id}>
                    <button className={activePrice === range.id ? 'active' : ''} onClick={() => setActivePrice(range.id)}>
                      {range.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="products-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>
                {isLoading ? 'Loading products…' : <>Showing <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{filteredProducts.length}</span> results</>}
              </p>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="product-grid">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <div style={{ height: '220px', backgroundColor: '#F1F5F9', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ height: '1rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
                      <div style={{ height: '0.75rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {fetchError && !isLoading && (
              <div style={{ backgroundColor: 'var(--white)', padding: '4rem', textAlign: 'center', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--error)', marginBottom: '0.5rem', fontWeight: '600' }}>Could not load products</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{fetchError}</p>
              </div>
            )}

            {/* Products or empty state */}
            {!isLoading && !fetchError && (
              filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--white)', padding: '4rem', textAlign: 'center', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                  <Search size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No products found</h3>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Try adjusting your filters or search query.</p>
                  <button className="btn btn-primary" onClick={() => { setActiveCategory('all'); setActivePrice('all'); setSearchQuery(''); }}>
                    Clear all filters
                  </button>
                </div>
              )
            )}
          </div>
        </div>

      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }`}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '6rem', textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-muted)' }}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
