import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

const DUMMY_BEST_SELLERS = [
  {
    id: 1,
    slug: 'hercules-roadeo',
    name: 'Hercules Roadeo Hannibal 27.5T',
    brand: 'Hercules',
    price: 14500,
    compare_at_price: 16000,
    primary_image_url: 'https://images.unsplash.com/photo-1576435728678-68ce0f6eb293?auto=format&fit=crop&w=500&q=80',
    stock_quantity: 5
  },
  {
    id: 2,
    slug: 'hero-kyoto',
    name: 'Hero Kyoto 26T Single Speed',
    brand: 'Hero',
    price: 6499,
    compare_at_price: 7999,
    primary_image_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80',
    stock_quantity: 12
  },
  {
    id: 3,
    slug: 'kids-electric-jeep',
    name: 'Kids 12V Battery Operated Jeep',
    brand: 'ToyHouse',
    price: 18999,
    compare_at_price: 22000,
    primary_image_url: 'https://images.unsplash.com/photo-1596461404969-9ce20c71c4c1?auto=format&fit=crop&w=500&q=80',
    stock_quantity: 3
  },
  {
    id: 4,
    slug: 'smart-helmet',
    name: 'Lumos Matrix Smart Helmet',
    brand: 'Lumos',
    price: 8999,
    compare_at_price: 9999,
    primary_image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=500&q=80',
    stock_quantity: 20
  }
];

export default function BestSellers() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--white)' }}>
      <div className="container">
        <h2 className="section-title">Best Sellers</h2>
        
        <div className="product-grid">
          {DUMMY_BEST_SELLERS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/products" className="btn btn-outline btn-lg">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
