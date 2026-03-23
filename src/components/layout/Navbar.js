"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const categories = [
    { name: 'Adult Cycles', path: '/products?category=adult-cycles' },
    { name: 'Kids Cycles', path: '/products?category=kids-cycles' },
    { name: 'Electric Cycles', path: '/products?category=electric-cycles' },
    { name: 'Mountain Bikes', path: '/products?category=mountain-bikes' },
    { name: 'Ride-on Toys', path: '/products?category=ride-on' },
    { name: 'Accessories', path: '/products?category=accessories' },
  ];

  return (
    <header className="navbar">
      {/* Top Main Nav */}
      <div className="container navbar-container">
        
        {/* Logo */}
        <Link href="/" className="navbar-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M11 2a9 9 0 0 1 8.256 12.372l3.451 3.451a1 1 0 0 1-1.32 1.497l-.094-.083-3.45-3.45A9 9 0 1 1 11 2Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z" />
            <path d="M11 7a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
          </svg>
          <span style={{ display: 'none' }}>GIRIRAM CYCLE MART</span>
        </Link>

        {/* Desktop Search */}
        <div className="navbar-search" style={{ display: 'none' }}>
          <input 
            type="text" 
            placeholder="Search cycles, accessories..." 
          />
          <Search size={20} className="navbar-search-icon" />
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          <Link href="/admin" className="navbar-actions-link">
            <User size={24} />
            <span style={{ marginTop: '0.25rem' }}>Admin</span>
          </Link>
          
          <Link href="/auth/login" className="navbar-actions-link">
            <User size={24} />
            <span style={{ marginTop: '0.25rem' }}>Login</span>
          </Link>
          
          <Link href="/cart" className="navbar-actions-link">
            <div className="navbar-cart">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="navbar-cart-badge">{cartCount}</span>
              )}
            </div>
            <span style={{ marginTop: '0.25rem' }}>Cart</span>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            style={{ display: 'block', outline: 'none', color: 'var(--text-muted)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 768px) {
          .navbar-search {
            display: flex !important;
          }
          .navbar-actions button {
            display: none !important;
          }
          .navbar-brand span {
            display: block !important;
          }
        }
      `}</style>

      {/* Categories Toolbar (Desktop) */}
      <div className="navbar-categories" style={{ display: 'none' }}>
        <div className="container">
          <ul className="navbar-categories-list">
            <li>
              <Link href="/products" className="navbar-categories-link" style={{ fontWeight: 'bold' }}>
                All Departments
              </Link>
            </li>
            {categories.map((cat, index) => (
              <li key={index}>
                <Link href={cat.path} className="navbar-categories-link">
                  {cat.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/repair/book" className="navbar-categories-link" style={{ color: '#FFB84D' }}>
                Book a Repair
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .navbar-categories {
            display: block !important;
          }
        }
      `}</style>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-color)', padding: '1rem' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Search..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)'}}
            />
            <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          
          <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Categories</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
                All Products
              </Link>
            </li>
            {categories.map((cat, index) => (
              <li key={index}>
                <Link href={cat.path} onClick={() => setIsMobileMenuOpen(false)}>
                  {cat.name}
                </Link>
              </li>
            ))}
            <li style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <Link href="/admin" style={{ color: 'var(--text-color)' }} onClick={() => setIsMobileMenuOpen(false)}>
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link href="/repair/book" style={{ color: 'var(--primary)', fontWeight: 'bold' }} onClick={() => setIsMobileMenuOpen(false)}>
                Book a Repair Service
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
