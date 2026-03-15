"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { 
  ShoppingBag, Users, Wrench, Settings, TrendingUp, Package, 
  PlusCircle, Edit, Trash2, X, Upload, Save, LogOut, Image as ImageIcon, IndianRupee, Copy, Link2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Check admin auth on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('gcm_admin_logged_in');
    if (loggedIn !== 'true') {
      router.replace('/admin/login');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('gcm_admin_logged_in');
    localStorage.removeItem('gcm_admin_email');
    toast.success('Logged out successfully');
    router.push('/admin/login');
  };

  // Dummy State
  const [products, setProducts] = useState([
    { id: 1, name: 'Hercules Roadeo Hannibal', price: 14500, stock: 5, category: 'Adult Cycles', image: null },
    { id: 2, name: 'Hero Kyoto 26T', price: 6499, stock: 12, category: 'Mountain Bikes', image: null },
    { id: 3, name: 'Lumos Smart Helmet', price: 8999, stock: 0, category: 'Accessories', image: null },
  ]);

  const [orders, setOrders] = useState([
    { id: 'ORD-89201', customer: 'John Doe', total: 14500, status: 'Processing', date: '2025-03-10', payment: 'COD', address: 'Bangalore, KA' },
    { id: 'ORD-89202', customer: 'Jane Smith', total: 8999, status: 'Shipped', date: '2025-03-12', payment: 'UPI', address: 'Chennai, TN' },
    { id: 'ORD-89203', customer: 'Ravi Kumar', total: 24999, status: 'Delivered', date: '2025-03-05', payment: 'Card', address: 'Hyderabad, TS' },
  ]);

  const [repairs, setRepairs] = useState([
    { id: 'REP-12345', customer: 'John Doe', phone: '+91 98765 43210', cycle: 'Hero Sprint Pro 27.5T', status: 'Pending', issue: 'Brake loose', date: '2025-03-14', cost: '' },
    { id: 'REP-98765', customer: 'Alice', phone: '+91 98765 43211', cycle: 'Hercules Roadeo', status: 'In Progress', issue: 'Gear shifting problem', date: '2025-03-13', cost: '1500' },
    { id: 'REP-55555', customer: 'Rahul', phone: '+91 98765 43212', cycle: 'Atlas Goldline', status: 'Completed', issue: 'Tire puncture & chain rust', date: '2025-03-10', cost: '800' },
  ]);

  const handleRepairCostChange = (repairId, cost) => {
    setRepairs(repairs.map(r => r.id === repairId ? { ...r, cost } : r));
  };

  const handleSetCost = (repairId) => {
    const repair = repairs.find(r => r.id === repairId);
    if (!repair.cost || isNaN(repair.cost) || Number(repair.cost) <= 0) {
      toast.error('Please enter a valid cost amount');
      return;
    }
    toast.success(`Cost ₹${Number(repair.cost).toLocaleString('en-IN')} set for ${repairId}`);
  };

  const copyPaymentLink = (repairId) => {
    const link = `${window.location.origin}/repair/pay?ref=${repairId}`;
    navigator.clipboard.writeText(link);
    toast.success('Payment link copied! Share with customer.');
  };

  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Admin User', email: 'admin@giriramcycles.com', role: 'Admin' },
    { id: 'usr-2', name: 'John Doe', email: 'john@example.com', role: 'User' },
    { id: 'usr-3', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ]);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '', category: 'Adult Cycles', image: null });

  // Order/Repair Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const stats = [
    { label: 'Total Revenue', value: '₹4,52,000', icon: TrendingUp, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Customers', value: usersList.filter(u => u.role === 'User').length, icon: Users, color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Pending Repairs', value: repairs.filter(r => r.status === 'Pending').length, icon: Wrench, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  const openProductModal = (product = null) => {
    if (product) { setEditingProduct(product); setProductForm(product); }
    else { setEditingProduct(null); setProductForm({ name: '', price: '', stock: '', category: 'Adult Cycles', image: null }); }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) { setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p)); toast.success('Product updated!'); }
    else { setProducts([...products, { ...productForm, id: Date.now() }]); toast.success('Product added!'); }
    setIsProductModalOpen(false);
  };

  const deleteProduct = (id) => { if(confirm('Delete this product?')) { setProducts(products.filter(p => p.id !== id)); toast.success('Product deleted!'); }};

  const handleImageUpload = (e) => { const file = e.target.files[0]; if (file) { setProductForm({...productForm, image: URL.createObjectURL(file)}); toast.success('Image uploaded!'); }};

  const openEditModal = (type, item) => { setEditType(type); setEditItem({...item}); setIsEditModalOpen(true); };

  const saveEdit = () => {
    if (editType === 'order') setOrders(orders.map(o => o.id === editItem.id ? editItem : o));
    else if (editType === 'repair') setRepairs(repairs.map(r => r.id === editItem.id ? editItem : r));
    else if (editType === 'user') setUsersList(usersList.map(u => u.id === editItem.id ? editItem : u));
    toast.success(`${editType} updated!`);
    setIsEditModalOpen(false);
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
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#DC2626', fontWeight: '600', fontSize: '0.875rem', border: '1px solid #FECACA' }}>
            <LogOut size={18} /> Logout
          </button>
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
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
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
                    {orders.slice(0, 3).map(o => (
                      <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div><p style={{ fontWeight: '600' }}>{o.id}</p><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{o.customer} • {o.payment}</p></div>
                        <div style={{ textAlign: 'right' }}><p style={{ fontWeight: '800' }}>₹{o.total.toLocaleString('en-IN')}</p><span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: o.status === 'Delivered' ? 'var(--success)' : 'var(--primary)' }}>{o.status}</span></div>
                      </div>
                    ))}
                  </div>
                  <div className="stat-card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Pending Repairs</h3>
                    {repairs.filter(r => r.status !== 'Completed').map(r => (
                      <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div><p style={{ fontWeight: '600' }}>{r.id}</p><p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r.customer} — {r.issue}</p></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: '#EFF6FF', color: '#1E3A8A' }}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* PRODUCTS */}
            {activeTab === 'products' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>Products ({products.length})</h2>
                  <Button onClick={() => openProductModal()} style={{ display: 'flex', alignItems: 'center' }}><PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> Add Product</Button>
                </div>
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
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}><div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><div style={{ width: '40px', height: '40px', backgroundColor: '#f1f5f9', borderRadius: '0.25rem', overflow: 'hidden' }}>{p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />: null}</div>{p.name}</div></td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{p.category}</td>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                        <td style={{ padding: '1rem 1.5rem' }}><span style={{ color: p.stock === 0 ? 'var(--error)' : 'var(--success)', fontWeight: '600' }}>{p.stock === 0 ? 'Out of Stock' : p.stock}</span></td>
                        <td style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                          <button onClick={() => openProductModal(p)} style={{ color: '#3B82F6' }}><Edit size={18} /></button>
                          <button onClick={() => deleteProduct(p.id)} style={{ color: '#EF4444' }}><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Orders ({orders.length})</h2></div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Order ID</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Customer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Address</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Payment</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Total</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                  </tr></thead>
                  <tbody>{orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{o.id}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{o.customer}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{o.address}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: '#F3F4F6', color: '#374151' }}>{o.payment}</span></td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>₹{o.total.toLocaleString()}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: o.status === 'Delivered' ? '#D1FAE5' : o.status === 'Shipped' ? '#DBEAFE' : '#FEF3C7', color: o.status === 'Delivered' ? '#065F46' : o.status === 'Shipped' ? '#1E3A8A' : '#B45309' }}>{o.status}</span></td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}><button onClick={() => openEditModal('order', o)} style={{ color: '#3B82F6' }}><Edit size={18} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* REPAIRS */}
            {activeTab === 'repairs' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Repair Bookings ({repairs.length})</h2></div>
                <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Ref ID</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Customer</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Phone</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Cycle</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Issue</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Cost (₹)</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                  </tr></thead>
                  <tbody>{repairs.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{r.id}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{r.customer}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{r.phone}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>{r.cycle}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{r.issue}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>₹</span>
                          <input
                            type="number"
                            className="cost-inline-input"
                            value={r.cost}
                            onChange={(e) => handleRepairCostChange(r.id, e.target.value)}
                            placeholder="0"
                          />
                          <button
                            onClick={() => handleSetCost(r.id)}
                            style={{ padding: '0.25rem 0.5rem', backgroundColor: '#EFF6FF', color: '#1E40AF', borderRadius: '0.25rem', fontSize: '0.6875rem', fontWeight: '700', border: '1px solid #BFDBFE', whiteSpace: 'nowrap' }}
                          >
                            Set
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: r.status === 'Completed' ? '#D1FAE5' : '#EFF6FF', color: r.status === 'Completed' ? '#065F46' : '#1E3A8A' }}>{r.status}</span></td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                          {r.cost && Number(r.cost) > 0 && (
                            <button onClick={() => copyPaymentLink(r.id)} title="Copy payment link" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
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
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}><h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>User Management</h2></div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Name</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Email</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>Role</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', textAlign: 'right' }}>Actions</th>
                  </tr></thead>
                  <tbody>{usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{u.name}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '1rem 1.5rem' }}><span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: u.role === 'Admin' ? '#FEE2E2' : '#F3F4F6', color: u.role === 'Admin' ? '#991B1B' : '#374151' }}>{u.role}</span></td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}><button onClick={() => openEditModal('user', u)} style={{ color: '#3B82F6' }}><Edit size={18} /></button></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="stat-card" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Store Settings</h2>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Store Name</label><input className="form-input" defaultValue="GIRIRAM CYCLE MART" /></div>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+91 98765 43210" /></div>
                  <div className="form-group focus-full"><label className="form-label">Address</label><input className="form-input" defaultValue="123 Cycle Street, Central Market, Bangalore 560001" /></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="support@giriramcycles.com" /></div>
                </div>
                <Button style={{ marginTop: '1rem' }}><Save size={18} style={{ marginRight: '0.5rem' }} /> Save Settings</Button>
              </div>
            )}

          </div>
        </div>

        {/* Product Modal */}
        {isProductModalOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setIsProductModalOpen(false)}><X size={24} /></button>
              </div>
              <form onSubmit={handleProductSubmit}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', border: '1px dashed var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {productForm.image ? <img src={productForm.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={24} style={{ color: 'var(--text-muted)' }} />}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backgroundColor: 'var(--bg-color)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                    <Upload size={16} /> Upload Image <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
                  </label>
                </div>
                <div style={{ marginBottom: '1rem' }}><label className="form-label">Product Name</label><input type="text" className="form-input" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required /></div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}><label className="form-label">Price (₹)</label><input type="number" className="form-input" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required /></div>
                  <div style={{ flex: 1 }}><label className="form-label">Stock</label><input type="number" className="form-input" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} required /></div>
                </div>
                <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Category</label>
                  <select className="form-input" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} required style={{ backgroundColor: 'white' }}>
                    <option>Adult Cycles</option><option>Kids Cycles</option><option>Electric Cycles</option><option>Mountain Bikes</option><option>Accessories</option>
                  </select>
                </div>
                <Button type="submit" className="btn-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Save size={18} /> Save Product</Button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editItem && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', textTransform: 'capitalize' }}>Update {editType}</h2>
                <button onClick={() => setIsEditModalOpen(false)}><X size={24} /></button>
              </div>
              <div style={{ marginBottom: '1.5rem' }}><label className="form-label">ID</label><input className="form-input" value={editItem.id} disabled style={{ backgroundColor: 'var(--bg-color)' }} /></div>
              {editType === 'order' && <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Order Status</label>
                <select className="form-input" value={editItem.status} onChange={e => setEditItem({...editItem, status: e.target.value})} style={{ backgroundColor: 'white' }}>
                  <option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                </select></div>}
              {editType === 'repair' && <><div style={{ marginBottom: '1.5rem' }}><label className="form-label">Repair Status</label>
                <select className="form-input" value={editItem.status} onChange={e => setEditItem({...editItem, status: e.target.value})} style={{ backgroundColor: 'white' }}>
                  <option>Pending</option><option>Diagnosing</option><option>In Progress</option><option>Completed</option>
                </select></div>
                <div style={{ marginBottom: '1.5rem' }}><label className="form-label">Repair Cost (₹)</label>
                <input type="number" className="form-input" placeholder="Enter repair cost" value={editItem.cost || ''} onChange={e => setEditItem({...editItem, cost: e.target.value})} />
                </div></>}
              {editType === 'user' && <div style={{ marginBottom: '1.5rem' }}><label className="form-label">User Role</label>
                <select className="form-input" value={editItem.role} onChange={e => setEditItem({...editItem, role: e.target.value})} style={{ backgroundColor: 'white' }}>
                  <option>User</option><option>Admin</option>
                </select></div>}
              <Button onClick={saveEdit} className="btn-full" style={{ padding: '0.75rem' }}>Update</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
