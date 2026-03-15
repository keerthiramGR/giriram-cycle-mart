"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, shippingOption, setShippingOption } = useCart();
  
  const shippingCost = shippingOption === 'express' ? 500 : 0;
  const grandTotal = cartTotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <ShoppingBag size={40} style={{ color: '#CBD5E1' }} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Looks like you haven't added any cycles or accessories to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="btn-full" style={{ padding: '1rem' }}>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        
        <div className="page-header">
          <h1 className="page-title">Shopping Cart</h1>
          <p className="page-subtitle">Review your items and proceed to checkout.</p>
        </div>

        <div className="cart-layout">
          
          {/* Cart Items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img 
                    src={item.primary_image_url} 
                    alt={item.name} 
                  />
                </div>
                
                <div className="cart-item-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{item.brand}</span>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)' }}>{item.name}</h3>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ width: '2.5rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.2s' }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Order Summary */}
          <div className="cart-summary">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              Order Summary
            </h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                {shippingOption === 'standard' ? 'FREE' : `₹${shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>
            
            <div style={{ margin: '1.5rem 0' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.75rem' }}>Shipping Method</label>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <label style={{ flex: 1, border: `2px solid ${shippingOption === 'standard' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', padding: '1rem', cursor: 'pointer', backgroundColor: shippingOption === 'standard' ? '#FFF7ED' : 'transparent', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="standard"
                    checked={shippingOption === 'standard'}
                    onChange={() => setShippingOption('standard')}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontWeight: '600', color: shippingOption === 'standard' ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.25rem' }}>Standard</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Free (5-7 Days)</div>
                </label>
                
                <label style={{ flex: 1, border: `2px solid ${shippingOption === 'express' ? 'var(--primary)' : 'var(--border-color)'}`, borderRadius: '0.5rem', padding: '1rem', cursor: 'pointer', backgroundColor: shippingOption === 'express' ? '#FFF7ED' : 'transparent', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="shipping" 
                    value="express"
                    checked={shippingOption === 'express'}
                    onChange={() => setShippingOption('express')}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontWeight: '600', color: shippingOption === 'express' ? 'var(--primary)' : 'var(--text-main)', marginBottom: '0.25rem' }}>Express</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹500 (1-3 Days)</div>
                </label>
              </div>
            </div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
            
            <Link href="/checkout">
              <Button size="lg" className="btn-full" style={{ padding: '1rem', fontSize: '1.125rem' }}>
                Proceed to Checkout <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
              </Button>
            </Link>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link href="/products" style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
                or <strong>Continue Shopping</strong>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
