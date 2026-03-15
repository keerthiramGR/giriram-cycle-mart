"use client";

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';

const CATEGORIES = [
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

const DUMMY_PRODUCTS = [
  { id: 1, slug: 'hercules-roadeo', name: 'Hercules Roadeo Hannibal 27.5T', brand: 'Hercules', price: 14500, compare_at_price: 16000, category_slug: 'adult-cycles', stock_quantity: 5, primary_image_url: 'https://images.unsplash.com/photo-1576435728678-68ce0f6eb293?auto=format&fit=crop&w=500&q=80' },
  { id: 2, slug: 'hero-kyoto', name: 'Hero Kyoto 26T Single Speed', brand: 'Hero', price: 6499, compare_at_price: 7999, category_slug: 'mountain-bikes', stock_quantity: 12, primary_image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80' },
  { id: 3, slug: 'kids-electric-jeep', name: 'Kids 12V Battery Operated Jeep', brand: 'ToyHouse', price: 18999, compare_at_price: 22000, category_slug: 'ride-on', stock_quantity: 3, primary_image_url: 'https://images.unsplash.com/photo-1596461404969-9ce20c71c4c1?auto=format&fit=crop&w=500&q=80' },
  { id: 4, slug: 'smart-helmet', name: 'Lumos Matrix Smart Helmet', brand: 'Lumos', price: 8999, compare_at_price: 9999, category_slug: 'accessories', stock_quantity: 20, primary_image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&q=80' },
  { id: 5, slug: 'hero-sprint', name: 'Hero Sprint Pro 27.5T', brand: 'Hero', price: 11200, compare_at_price: 13500, category_slug: 'adult-cycles', stock_quantity: 0, primary_image_url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=500&q=80' },
  { id: 6, slug: 'emotorad-x1', name: 'EMotorad X1 Electric Cycle', brand: 'EMotorad', price: 24999, compare_at_price: 28000, category_slug: 'electric-cycles', stock_quantity: 4, primary_image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=500&q=80' },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activePrice, setActivePrice] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredProducts = DUMMY_PRODUCTS.filter(product => {
    if (activeCategory !== 'all' && product.category_slug !== activeCategory) return false;
    if (activePrice !== 'all') {
      const range = PRICE_RANGES.find(r => r.id === activePrice);
      if (product.price < range.min || product.price > range.max) return false;
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      if (!product.name.toLowerCase().includes(lowerQuery) && 
          !product.brand.toLowerCase().includes(lowerQuery)) {
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
        <button 
          className="mobile-filter-btn"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
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
                {CATEGORIES.map(category => (
                  <li key={category.id}>
                    <button 
                      className={activeCategory === category.id ? 'active' : ''}
                      onClick={() => setActiveCategory(category.id)}
                    >
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
                    <button 
                      className={activePrice === range.id ? 'active' : ''}
                      onClick={() => setActivePrice(range.id)}
                    >
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
                Showing <span style={{ fontWeight: 'bold', color: 'var(--secondary)' }}>{filteredProducts.length}</span> results
              </p>
            </div>
            
            {filteredProducts.length > 0 ? (
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
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setActiveCategory('all');
                    setActivePrice('all');
                    setSearchQuery('');
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
