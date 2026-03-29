"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer-grid">
          
          {/* Brand & About */}
          <div className="footer-col" style={{ gridColumn: 'span 2' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--white)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="28" height="28" style={{ color: 'var(--primary)' }}>
                <path d="M11 2a9 9 0 0 1 8.256 12.372l3.451 3.451a1 1 0 0 1-1.32 1.497l-.094-.083-3.45-3.45A9 9 0 1 1 11 2Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" />
              </svg>
              GIRIRAM CYCLE MART
            </h2>
            <p style={{ maxWidth: '400px' }}>
              Your premium destination for cycles, accessories, and professional repair services. We believe in providing the best quality rides for everyone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }}><Facebook size={24} /></a>
              <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }}><Twitter size={24} /></a>
              <a href="#" style={{ color: '#94A3B8', transition: 'color 0.2s' }}><Instagram size={24} /></a>
            </div>
          </div>

          {/* Customer Service */}
          <div className="footer-col">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--white)' }}>Customer Service</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/track" style={{ color: '#E2E8F0', textDecoration: 'none', transition: 'color 0.2s' }}>Track Order/Repair</Link></li>
              <li><Link href="/contact" style={{ color: '#E2E8F0', textDecoration: 'none', transition: 'color 0.2s' }}>Contact Us</Link></li>
              <li><Link href="/faq" style={{ color: '#E2E8F0', textDecoration: 'none', transition: 'color 0.2s' }}>FAQ</Link></li>
              <li><Link href="/shipping" style={{ color: '#E2E8F0', textDecoration: 'none', transition: 'color 0.2s' }}>Shipping Policy</Link></li>
              <li><Link href="/returns" style={{ color: '#E2E8F0', textDecoration: 'none', transition: 'color 0.2s' }}>Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Shop All</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h3>Categories</h3>
            <ul className="footer-links">
              <li><Link href="/products?category=adult-cycles">Adult Cycles</Link></li>
              <li><Link href="/products?category=kids-cycles">Kids Cycles</Link></li>
              <li><Link href="/products?category=electric">Electric Cycles</Link></li>
              <li><Link href="/products?category=accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3>Contact Us</h3>
            <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>SH 15, Gobichettipalayam<br/>Tamil Nadu 638452</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>+91 98652 22646</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>support@giriramcycles.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} GIRIRAM CYCLE MART. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
