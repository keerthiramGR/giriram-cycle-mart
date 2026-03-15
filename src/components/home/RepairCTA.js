import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Wrench, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function RepairCTA() {
  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-color)' }}>
      <div className="container">
        <div className="repair-cta">
          
          <div className="repair-content">
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '1rem' }}>
              <Wrench size={16} style={{ marginRight: '0.5rem' }} /> CYCLE REPAIR SERVICES
            </div>
            
            <h2>Is your cycle acting up? Let our experts fix it.</h2>
            <p>
              From a simple puncture to full gear overhauls, our experienced technicians handle it all. Book a service slot online and drop your cycle at our store.
            </p>
            
            <div className="repair-features">
              <div className="repair-feature">
                <ShieldCheck className="text-primary" />
                <span>Expert certified technicians</span>
              </div>
              <div className="repair-feature">
                <Clock className="text-primary" />
                <span>Quick turnaround time (24-48 hrs)</span>
              </div>
              <div className="repair-feature">
                <MapPin className="text-primary" />
                <span>Convenient drop-off at store</span>
              </div>
            </div>
            
            <Link href="/repair/book">
              <Button size="lg" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem' }}>
                Book a Repair Now
              </Button>
            </Link>
          </div>
          
          <div className="repair-image" style={{ position: 'relative', height: '400px', borderRadius: '1rem', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1579309401389-a544a04ebd71?auto=format&fit=crop&w=800&q=80" 
              alt="Cycle repairing"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
