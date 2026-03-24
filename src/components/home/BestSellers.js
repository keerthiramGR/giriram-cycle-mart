"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

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

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBestSellers() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.products) {
          setProducts(json.products.slice(0, 4).map(mapProduct));
        }
      } catch (err) {
        console.error("Failed to fetch best sellers");
      } finally {
        setIsLoading(false);
      }
    }
    loadBestSellers();
  }, []);

  return (
    <section className="section" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container">
        <h2 className="section-title">Best Sellers</h2>
        
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            Loading Best Sellers...
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No products available
          </div>
        )}
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/products" className="btn btn-outline btn-lg">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
