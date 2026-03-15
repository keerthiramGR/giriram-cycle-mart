import Link from 'next/link';
import { Bike, Sparkles, Zap, Wrench } from 'lucide-react';

const categories = [
  { name: 'Adult Cycles', icon: <Bike size={32} />, path: '/products?category=adult-cycles' },
  { name: 'Kids Cycles', icon: <Sparkles size={32} />, path: '/products?category=kids-cycles' },
  { name: 'Electric', icon: <Zap size={32} />, path: '/products?category=electric-cycles' },
  { name: 'Accessories', icon: <Wrench size={32} />, path: '/products?category=accessories' },
];

export default function CategorySection() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="container">
        <h2 className="section-title">Shop by Category</h2>
        
        <div className="category-grid">
          {categories.map((category, idx) => (
            <Link key={idx} href={category.path} className="category-item">
              <div className="category-icon">
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
