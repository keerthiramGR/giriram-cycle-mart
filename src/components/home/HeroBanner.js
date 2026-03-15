import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HeroBanner() {
  return (
    <div className="hero">
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      
      <div className="hero-content">
        <div style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          PREMIUM CYCLE STORE
        </div>
        
        <h1 className="hero-title">
          Ride into the Future with <span>GIRIRAM CYCLE MART</span>
        </h1>
        
        <p className="hero-subtitle">
          Explore our vast collection of adult, kids, and electric cycles. Professional repair services also available at your doorstep.
        </p>
        
        <div className="hero-actions">
          <Link href="/products">
            <Button size="lg" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
              Shop Now
            </Button>
          </Link>
          <Link href="/repair/book">
            <Button variant="outline" size="lg" style={{ fontSize: '1.125rem', padding: '1rem 2rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Book Repair
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
