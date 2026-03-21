"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { User, Package, Wrench, LogOut, Settings, Clock, CheckCircle } from 'lucide-react';

export default function UserProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  const profileName = user?.user_metadata?.full_name || 'Guest User';
  const profileEmail = user?.email || 'guest@example.com';
  const profilePhone = user?.user_metadata?.phone || '';

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const MOCK_ORDERS = [
    { id: 'ORD-89234', date: 'Oct 28, 2023', total: 14500, status: 'Delivered', items: 'Hercules Roadeo Hannibal' },
    { id: 'ORD-76492', date: 'Sep 15, 2023', total: 8999, status: 'Delivered', items: 'Lumos Matrix Smart Helmet' },
  ];

  const MOCK_REPAIRS = [
    { id: 'REP-12345', date: 'Oct 24, 2023', cost: 850, status: 'In Progress', cycle: 'Hero Sprint Pro 27.5T' },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        
        <div className="dashboard-layout">
          
          {/* Sidebar */}
          <div className="sidebar-menu">
            <div style={{ padding: '1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '6rem', height: '6rem', backgroundColor: 'rgba(255,107,0,0.2)', border: '4px solid rgba(255,107,0,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--primary)', fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase' }}>
                {profileName.charAt(0)}
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{profileName}</h2>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{profileEmail}</p>
            </div>
            
            <nav style={{ padding: '0.5rem' }}>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              >
                <Package size={20} style={{ marginRight: '0.75rem' }} /> My Orders
              </button>
              <button 
                onClick={() => setActiveTab('repairs')}
                className={`menu-item ${activeTab === 'repairs' ? 'active' : ''}`}
              >
                <Wrench size={20} style={{ marginRight: '0.75rem' }} /> Repair History
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}
              >
                <Settings size={20} style={{ marginRight: '0.75rem' }} /> Account Settings
              </button>
            </nav>
            
            <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
              <button 
                onClick={handleSignOut}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '500', color: 'var(--error)', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', transition: 'background-color 0.2s' }}
              >
                <LogOut size={20} style={{ marginRight: '0.75rem' }} /> Sign Out
              </button>
            </div>
            
          </div>
          
          {/* Main Content Area */}
          <div className="dashboard-content">
            
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '2rem', minHeight: '500px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  <Package style={{ marginRight: '0.75rem', color: 'var(--primary)' }} /> My Orders
                </h2>
                
                {MOCK_ORDERS.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MOCK_ORDERS.map((order) => (
                      <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.25rem', transition: 'border-color 0.2s' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: '700', color: 'var(--secondary)', backgroundColor: '#F1F5F9', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>{order.id}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.75rem' }}>Placed on {order.date}</span>
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '1.125rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                            ₹{order.total.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                              <Package size={24} />
                            </div>
                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{order.items}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '500', color: 'var(--success)', backgroundColor: '#ECFDF5', padding: '0.375rem 0.75rem', borderRadius: '9999px' }}>
                            <CheckCircle size={16} style={{ marginRight: '0.375rem' }} /> {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px dashed #CBD5E1' }}>
                    <Package size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>You haven't placed any orders yet.</p>
                    <Button style={{ marginTop: '1.5rem' }} variant="outline">Start Shopping</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Repairs Tab */}
            {activeTab === 'repairs' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '2rem', minHeight: '500px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  <Wrench style={{ marginRight: '0.75rem', color: 'var(--primary)' }} /> Repair History
                </h2>
                
                {MOCK_REPAIRS.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {MOCK_REPAIRS.map((repair) => (
                      <div key={repair.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.75rem', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                          <div>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', backgroundColor: 'rgba(255,107,0,0.1)', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>{repair.id}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginLeft: '0.75rem' }}>Booked on {repair.date}</span>
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '1.125rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>
                            Est. ₹{repair.cost.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: '3rem', height: '3rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                              <Wrench size={24} />
                            </div>
                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{repair.cycle}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#D97706', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
                            <Clock size={16} style={{ marginRight: '0.375rem' }} /> {repair.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '4rem 0', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px dashed #CBD5E1' }}>
                    <Wrench size={48} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>You have no repair history.</p>
                    <Button style={{ marginTop: '1.5rem' }} variant="outline">Book a Repair</Button>
                  </div>
                )}
              </div>
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '2rem', minHeight: '500px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                  <Settings style={{ marginRight: '0.75rem', color: 'var(--primary)' }} /> Account Settings
                </h2>
                
                <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={profileName}
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      defaultValue={profilePhone}
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={profileEmail}
                      disabled
                      className="form-input" 
                      style={{ backgroundColor: '#F8FAFC', cursor: 'not-allowed', color: 'var(--text-muted)' }}
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Email address cannot be changed</p>
                  </div>
                  <div style={{ paddingTop: '1rem' }}>
                    <Button>Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
          
        </div>
      </div>
    </div>
  );
}
