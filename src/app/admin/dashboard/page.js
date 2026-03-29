"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { 
  ShoppingBag, Users, Wrench, Settings, TrendingUp, Package, 
  PlusCircle, Edit, Trash2, X, Upload, Save, LogOut, Image as ImageIcon, IndianRupee, Link2, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Live Data State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [usersList] = useState([
    { id: 'usr-1', name: 'Admin', phone: '', email: 'admin@giriramcycles.com', role: 'Admin' },
  ]);

  // Check admin auth on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('gcm_admin_logged_in');
    if (loggedIn !== 'true') {
      router.replace('/admin/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  // ---------- DATA FETCHERS ----------

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setProducts(json.products || []);
    } catch (err) {
      toast.error('Failed to load products: ' + err.message);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setOrders(json.orders || []);
    } catch (err) {
      toast.error('Failed to load orders: ' + err.message);
    }
  }, []);

  const fetchRepairs = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/repairs');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setRepairs(json.repairs || []);
    } catch (err) {
      toast.error('Failed to load repairs: ' + err.message);
    }
  }, []);

  // Fetch all data when authed
  useEffect(() => {
    if (!isAuthed) return;
    setLoading(true);
    Promise.all([fetchProducts(), fetchOrders(), fetchRepairs()]).finally(() => setLoading(false));
  }, [isAuthed, fetchProducts, fetchOrders, fetchRepairs]);

  const handleLogout = () => {
    localStorage.removeItem('gcm_admin_logged_in');
    localStorage.removeItem('gcm_admin_email');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  // ---------- PRODUCT OPERATIONS ----------

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: 'Adult Cycles', image: null, colors: '', age_category: '' });

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        price: product.price || '',
        stock: product.stock_quantity || '',
        category: product.categories?.name || 'Adult Cycles',
        image: product.primary_image_url || null,
        colors: product.colors || '',
        age_category: product.age_category || '',
      });
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', price: '', stock: '', category: 'Adult Cycles', image: null, colors: '', age_category: '' });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(editingProduct ? 'Updating product...' : 'Adding product...');
    try {
      const payload = { ...productForm, id: editingProduct?.id };
      const res = await fetch('/api/admin/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success(editingProduct ? 'Product updated!' : 'Product added!', { id: toastId });
      setIsProductModalOpen(false);
      await fetchProducts();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success('Product deleted!', { id: toastId });
      await fetchProducts();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductForm({ ...productForm, image: URL.createObjectURL(file) });
      const toastId = toast.loading('Uploading image to secure storage...');
      setIsUploading(true);
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        
        setProductForm(prev => ({ ...prev, image: json.publicUrl }));
        toast.success('Image securely uploaded!', { id: toastId });
      } catch (err) {
        toast.error('Image upload failed: ' + err.message, { id: toastId });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // ---------- REPAIR OPERATIONS ----------

  const handleRepairCostChange = (repairId, cost) => {
    setRepairs(repairs.map(r => r.id === repairId ? { ...r, estimated_cost: cost } : r));
  };

  const handleSetCost = async (repairId) => {
    const repair = repairs.find(r => r.id === repairId);
    const cost = repair?.estimated_cost;
    if (!cost || isNaN(cost) || Number(cost) <= 0) {
      toast.error('Please enter a valid cost amount');
      return;
    }
    const toastId = toast.loading('Saving cost...');
    try {
      const res = await fetch('/api/admin/repairs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: repairId, estimated_cost: Number(cost) }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      toast.success(`Cost ₹${Number(cost).toLocaleString('en-IN')} set!`, { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const copyPaymentLink = (repairId) => {
    const link = `${window.location.origin}/repair/pay?ref=${repairId}`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied! Share with customer.');
  };

  // ---------- ORDER / REPAIR EDIT MODAL ----------

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const openEditModal = (type, item) => { setEditType(type); setEditItem({ ...item }); setIsEditModalOpen(true); };

  const saveEdit = async () => {
    const toastId = toast.loading('Saving...');
    try {
      if (editType === 'order') {
        const res = await fetch('/api/admin/orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, status: editItem.status }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        await fetchOrders();
      } else if (editType === 'repair') {
        const res = await fetch('/api/admin/repairs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editItem.id, status: editItem.status, estimated_cost: editItem.estimated_cost }),
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        await fetchRepairs();
      }
      toast.success(`${editType} updated!`, { id: toastId });
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  // ---------- STATS ----------

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Revenue', value: '₹' + orders.reduce((s, o) => s + Number(o.total_amount || 0), 0).toLocaleString('en-IN'), icon: TrendingUp, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Pending Repairs', value: repairs.filter(r => r.status === 'submitted' || r.status === 'accepted' || r.status === 'in_progress').length, icon: Wrench, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  // ---------- HELPER ----------
  const fmtStatus = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : '';
  const statusColor = (s) => {
    if (!s) return {};
    const m = { delivered: ['#D1FAE5','#065F46'], completed: ['#D1FAE5','#065F46'], shipped: ['#DBEAFE','#1E3A8A'], processing: ['#FEF3C7','#B45309'], pending: ['#FEF3C7','#B45309'], submitted: ['#FEF3C7','#B45309'], in_progress: ['#DBEAFE','#1E3A8A'], cancelled: ['#FEE2E2','#991B1B'] };
    const [bg, color] = m[s] || ['#F3F4F6','#374151'];
    return { backgroundColor: bg, color };
  };

  if (!isAuthed) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p>Checking authorization...</p></div>;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.025em' }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Welcome, admin@giriramcycles.com</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => { setLoading(true); Promise.all([fetchProducts(), fetchOrders(), fetchRepairs()]).finally(() => setLoading(false)); toast.success('Data refreshed!'); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#EFF6FF', color: '#1E40AF', fontWeight: '600', fontSize: '0.875rem', border: '1px solid #BFDBFE' }}>
              <RefreshCw size={16} /> Refresh
            </button>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '600', fontSize: '0.875rem', border: '1px solid #FECACA' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
        
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="sidebar-menu" style={{ backgroundColor: 'var(--white)', padding: '0.75rem', height: 'fit-content' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'repairs', label: 'Repairs', icon: Wrench },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                    style={{ backgroundColor: activeTab === item.id ? 'var(--primary)' : 'transparent', color: activeTab === item.id ? 'white' : 'var(--text-muted)', boxShadow: activeTab === item.id ? '0 4px 6px -1px rgba(255, 107, 0, 0.2)' : 'none' }}>
                    <Icon size={20} style={{ marginRight: '0.75rem', color: activeTab === item.id ? 'white' : '#94A3B8' }} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="dashboard-content">
            
            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <p>Loading dashboard data...</p>
              </div>
            )}

            {/* OVERVIEW */}
            {!loading && activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="stats-grid">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="stat-card">
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', backgroundColor: stat.bg, color: stat.color }}><Icon size={24} /></div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{stat.label}</h3>
                        <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)' }}>{stat.value}</p>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="stat-card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Recent Orders</h3>
                    {orders.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No orders yet</p> : orders.slice(0, 5).map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div><p style={{ fontWeight: '600' }}>{o.order_ref || o.id.slice(0,8)}</p><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{o.customer_name || 'Guest'} • {o.payment_method}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontWeight: '800' }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</p><span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', ...statusColor(o.status) }}>{fmtStatus(o.status)}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="stat-card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Recent Repairs</h3>
                    {repairs.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No repair bookings yet</p> : repairs.slice(0, 5).map(r => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div><p style={{ fontWeight: '600' }}>{r.tracking_id}</p><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r.customer_name} — {r.issue_description?.slice(0,30)}</p></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', ...statusColor(r.status) }}>{fmtStatus(r.status)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* PRODUCTS */}
            {!loading && activeTab === 'products' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>Products ({products.length})</h2>
                  <Button onClick={() => openProductModal()} style={{ display: 'flex', alignItems: 'center' }}><PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> Add Product</Button>
                </div>
                {products.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No products yet. Click "Add Product" to get started.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Product Name</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Category</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Price</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Stock</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                      </tr></thead>
                      <tbody>{products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', overflow: 'hidden', flexShrink: 0 }}>
                                {p.primary_image_url ? <img src={p.primary_image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : null}
                              </div>
                              {p.name}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{p.categories?.name || '—'}</td>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                          <td style={{ padding: '1rem 1.5rem' }}><span style={{ color: p.stock_quantity === 0 ? 'var(--error)' : 'var(--success)', fontWeight: '600' }}>{p.stock_quantity === 0 ? 'Out of Stock' : p.stock_quantity}</span></td>
                          <td style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button onClick={() => openProductModal(p)} style={{ color: '#3B82F6' }}><Edit size={18} /></button>
                            <button onClick={() => deleteProduct(p.id)} style={{ color: '#EF4444' }}><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ORDERS */}
            {!loading && activeTab === 'orders' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Orders ({orders.length})</h2></div>
                {orders.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No orders yet.</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Order Ref</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Customer</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Location</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Payment</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Total</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Status</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                    </tr></thead>
                    <tbody>{orders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{o.order_ref || o.id.slice(0,8)}</td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                          <div style={{ color: 'var(--secondary)', fontWeight: '600' }}>{o.customer_name || 'Guest'}</div>
                          <div style={{ fontSize: '0.75rem', marginTop: '0.125rem' }}>{o.customer_phone || '—'}</div>
                          <div style={{ fontSize: '0.75rem' }}>{o.customer_email}</div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                          {o.shipping_address ? (
                            <>
                              <div>{o.shipping_address.city}, {o.shipping_address.state}</div>
                              <div style={{ fontSize: '0.75rem' }}>{o.shipping_address.pincode}</div>
                            </>
                          ) : '—'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#F3F4F6', color: '#374151' }}>{o.payment_method}</span></td>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', ...statusColor(o.status) }}>{fmtStatus(o.status)}</span></td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}><button onClick={() => openEditModal('order', o)} style={{ color: '#3B82F6' }}><Edit size={18} /></button></td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            )}

            {/* REPAIRS */}
            {!loading && activeTab === 'repairs' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Repair Bookings ({repairs.length})</h2></div>
                {repairs.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Wrench size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <p>No repair bookings yet.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                      <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Ref ID</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Customer</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Phone</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Cycle</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Issue</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Date</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Cost (₹)</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                      </tr></thead>
                      <tbody>{repairs.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{r.tracking_id}</td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{r.customer_name}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{r.phone_number}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>{r.cycle_model}</td>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '160px' }}>{r.issue_description?.slice(0, 40)}{r.issue_description?.length > 40 ? '…' : ''}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r.preferred_date}</td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>₹</span>
                              <input type="number" className="cost-inline-input" value={r.estimated_cost || ''} onChange={(e) => handleRepairCostChange(r.id, e.target.value)} placeholder="0" />
                              <button onClick={() => handleSetCost(r.id)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: '700', border: '1px solid #BFDBFE', whiteSpace: 'nowrap' }}>Set</button>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', ...statusColor(r.status) }}>{fmtStatus(r.status)}</span></td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                              {r.estimated_cost && Number(r.estimated_cost) > 0 && (
                                <button onClick={() => copyPaymentLink(r.tracking_id)} title="Copy payment link" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                                  <Link2 size={16} /> Pay Link
                                </button>
                              )}
                              <button onClick={() => openEditModal('repair', r)} style={{ color: '#3B82F6' }}><Edit size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* USERS */}
            {!loading && activeTab === 'users' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>User Management</h2></div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Name</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Phone</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Email</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Role</th>
                  </tr></thead>
                  <tbody>{usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: u.role === 'Admin' ? '#FEE2E2' : '#F3F4F6', color: u.role === 'Admin' ? '#991B1B' : '#374151' }}>{u.role}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* SETTINGS */}
            {!loading && activeTab === 'settings' && (
              <div className="stat-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Store Settings</h2>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" defaultValue="GIRIRAM CYCLE MART" /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 98652 22646" /></div>
                  <div className="form-group focus-full"><label className="form-label">Address</label><input className="form-input" defaultValue="SH 15, Gobichettipalayam, Tamil Nadu 638452" /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="support@giriramcycles.com" /></div>
                </div>
                <Button style={{ marginTop: '1rem' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Settings</Button>
              </div>
            )}

          </div>
        </div>

        {/* Product Modal */}
        {isProductModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsProductModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleProductSubmit}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {productForm.image ? <img src={productForm.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', width: 'fit-content' }}>
                      <Upload size={16} /> Upload Image <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                    </label>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Or enter image URL below</p>
                    <input type="text" className="form-input" placeholder="/images/products/my-product.png" value={productForm.image || ''} onChange={e => setProductForm({ ...productForm, image: e.target.value })} style={{ marginTop: '0.5rem', fontSize: '0.8rem' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}><label className="form-label">Product Name *</label><input type="text" className="form-input" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required /></div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}><label className="form-label">Price (₹) *</label><input type="number" className="form-input" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Stock *</label><input type="number" className="form-input" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} required /></div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Category *</label>
                  <select className="form-input" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} required style={{ backgroundColor: 'white' }}>
                    <option>Adult Cycles</option><option>Kids Cycles</option><option>Electric Cycles</option><option>Mountain Bikes</option><option>Kids Ride-on Vehicles</option><option>Accessories</option>
                  </select>
                </div>
                <Button type="submit" className="btn-full" disabled={isUploading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: isUploading ? 0.6 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}>
                  <Save size={18} /> {isUploading ? 'Uploading Image...' : 'Save Product'}
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editItem && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'capitalize' }}>Update {editType}</h2>
                <button onClick={() => setIsEditModalOpen(false)}><X size={24} /></button>
              </div>
              <div style={{ marginBottom: '1.5rem' }}><label className="form-label">ID</label><input className="form-input" value={editType === 'order' ? (editItem.order_ref || editItem.id) : (editItem.tracking_id || editItem.id)} disabled style={{ backgroundColor: 'var(--bg-color)' }} /></div>
              {editType === 'order' && <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Order Status</label>
                <select className="form-input" value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} style={{ backgroundColor: 'white' }}>
                  <option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                </select></div>}
              {editType === 'repair' && <>
                <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Repair Status</label>
                  <select className="form-input" value={editItem.status} onChange={e => setEditItem({ ...editItem, status: e.target.value })} style={{ backgroundColor: 'white' }}>
                    <option value="submitted">Submitted</option><option value="accepted">Accepted</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="ready_for_pickup">Ready for Pickup</option><option value="cancelled">Cancelled</option>
                  </select></div>
                <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Repair Cost (₹)</label>
                  <input type="number" className="form-input" placeholder="Enter repair cost" value={editItem.estimated_cost || ''} onChange={e => setEditItem({ ...editItem, estimated_cost: e.target.value })} />
                </div></>}
              <Button onClick={saveEdit} className="btn-full" style={{ padding: '0.75rem' }}>Update</Button>
            </div>
          </div>
        )}

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
