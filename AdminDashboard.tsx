
import React, { useState, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Trash2, 
  Edit3, 
  Phone, 
  Plus, 
  X, 
  CheckCircle, 
  Clock, 
  Truck, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Camera,
  Image as ImageIcon,
  Save,
  Search
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Language, Product, Order, ManagerTab } from './types';
import { PRODUCTS, MOCK_ORDERS } from './constants';

interface AdminDashboardProps {
  lang: Language;
  onExit: () => void;
}

interface ShippingSettings {
  standardFee: number;
  freeThreshold: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ lang, onExit }) => {
  const isRtl = lang === Language.AR;
  const [activeTab, setActiveTab] = useState<ManagerTab>('analytics');
  
  // Local state for management
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.map(o => ({
    ...o, 
    phone: '0660111801', 
    city: isRtl ? 'الصويرة' : 'Essaouira',
    status: o.status as any
  })));
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [shipping, setShipping] = useState<ShippingSettings>({ standardFee: 40, freeThreshold: 500 });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Advanced Product Management State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ 
    category: 'oil',
    stock: 0,
    price: 0,
    nameKey: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered Products for the table
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.nameKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Chart Mock Data
  const salesTrendData = useMemo(() => [
    { day: isRtl ? 'الاثنين' : 'Mon', revenue: 1200 },
    { day: isRtl ? 'الثلاثاء' : 'Tue', revenue: 1900 },
    { day: isRtl ? 'الأربعاء' : 'Wed', revenue: 1500 },
    { day: isRtl ? 'الخميس' : 'Thu', revenue: 2800 },
    { day: isRtl ? 'الجمعة' : 'Fri', revenue: 2100 },
    { day: isRtl ? 'السبت' : 'Sat', revenue: 3500 },
    { day: isRtl ? 'الأحد' : 'Sun', revenue: 2900 },
  ], [isRtl]);

  const topProductsData = useMemo(() => [
    { name: isRtl ? 'زيت زيتون' : 'Olive Oil', sold: 45 },
    { name: isRtl ? 'أملو' : 'Amlou', sold: 38 },
    { name: isRtl ? 'عسل حر' : 'Pure Honey', sold: 29 },
    { name: isRtl ? 'أركان' : 'Argan', sold: 22 },
  ], [isRtl]);

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nameKey) return;

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...editingProduct,
        nameKey: newProduct.nameKey!,
        price: newProduct.price || 0,
        stock: newProduct.stock || 0,
        category: newProduct.category as any,
        image: previewImage || editingProduct.image
      } : p));
      setEditingProduct(null);
    } else {
      const created: Product = {
        id: `p${Date.now()}`,
        nameKey: newProduct.nameKey,
        descKey: 'customProductDesc',
        price: newProduct.price || 0,
        stock: newProduct.stock || 0,
        category: newProduct.category as any,
        image: previewImage || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=400'
      };
      setProducts([created, ...products]);
    }

    setNewProduct({ category: 'oil', stock: 0, price: 0, nameKey: '' });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      nameKey: product.nameKey,
      price: product.price,
      stock: product.stock,
      category: product.category
    });
    setPreviewImage(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const statusMap = {
    pending: { label: isRtl ? 'جديد' : 'New', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30', icon: Clock },
    confirmed: { label: isRtl ? 'مؤكد' : 'Confirmed', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: CheckCircle },
    shipped: { label: isRtl ? 'قيد الشحن' : 'Shipped', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: Truck },
    delivered: { label: isRtl ? 'تم التوصيل' : 'Delivered', color: 'text-green-500 bg-green-500/10 border-green-500/30', icon: CheckCircle },
    cancelled: { label: isRtl ? 'ملغي' : 'Cancelled', color: 'text-red-500 bg-red-500/10 border-red-500/30', icon: X },
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row ${isRtl ? 'font-arabic' : 'font-latin'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black/90 border-r border-gold-text/10 flex flex-col h-auto md:h-screen sticky top-0 z-50">
        <div className="p-8 border-b border-gold-text/10">
          <h2 className="text-gold-text font-bold tracking-widest text-xl uppercase leading-none">Izouran</h2>
          <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-2 font-bold">Manager Portal</p>
        </div>

        <nav className="p-4 space-y-2 flex-grow">
          {[
            { id: 'analytics', icon: LayoutDashboard, label: isRtl ? 'الإحصائيات' : 'Analytics' },
            { id: 'orders', icon: ShoppingCart, label: isRtl ? 'الطلبيات' : 'Orders' },
            { id: 'pricing', icon: Package, label: isRtl ? 'المنتجات' : 'Inventory' },
            { id: 'settings', icon: Settings, label: isRtl ? 'الإعدادات' : 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ManagerTab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                activeTab === tab.id ? 'gold-bg text-black font-bold shadow-gold' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gold-text/10">
          <button onClick={onExit} className="w-full py-4 rounded-xl border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/5 transition-all">
            Exit System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-fadeIn">
            <header>
              <h1 className="text-4xl font-bold text-white mb-2">{isRtl ? 'لوحة التحكم' : 'Analytics Overview'}</h1>
              <p className="text-gray-500 text-sm tracking-wide">{isRtl ? 'مراقبة أداء المتجر في الوقت الحقيقي' : 'Real-time performance monitoring for Izouran Bio'}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: isRtl ? 'إجمالي الإيرادات' : 'Total Revenue', value: '12,450 MAD', trend: '▲ 12%', icon: DollarSign, color: 'text-gold-text' },
                { label: isRtl ? 'إجمالي الطلبات' : 'Total Orders', value: '45', trend: '▲ 8%', icon: ShoppingCart, color: 'text-blue-400' },
                { label: isRtl ? 'إجمالي الزوار' : 'Total Visitors', value: '1,203', trend: '▲ 24%', icon: Users, color: 'text-purple-400' },
                { label: isRtl ? 'معدل التحويل' : 'Conversion Rate', value: '3.2%', trend: '▼ 1%', icon: Target, color: 'text-green-500' }
              ].map((kpi, i) => (
                <div key={i} className="glass gold-border p-8 rounded-[32px] hover:bg-white/5 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-white/5 ${kpi.color}`}>
                      <kpi.icon size={20} />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${kpi.trend.includes('▲') ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                      {kpi.trend}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{kpi.label}</p>
                  <p className="text-3xl font-bold text-white group-hover:text-gold-text transition-colors">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass gold-border p-10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white">{isRtl ? 'اتجاه المبيعات' : 'Sales Trend'}</h3>
                    <p className="text-xs text-gray-500 mt-1">{isRtl ? 'الإيرادات اليومية بالدرهم' : 'Daily revenue in MAD'}</p>
                  </div>
                  <TrendingUp className="text-gold-text" size={20} />
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="day" stroke="#666" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #d4af37', borderRadius: '16px' }}
                        itemStyle={{ color: '#d4af37', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={4} dot={{ fill: '#d4af37', r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass gold-border p-10 rounded-[40px] space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white">{isRtl ? 'المنتجات الأكثر مبيعاً' : 'Top Products'}</h3>
                    <p className="text-xs text-gray-500 mt-1">{isRtl ? 'الوحدات المباعة حسب المنتج' : 'Units sold per product'}</p>
                  </div>
                  <BarChart3 className="text-gold-text" size={20} />
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topProductsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #d4af37', borderRadius: '16px' }} />
                      <Bar dataKey="sold" fill="#d4af37" radius={[12, 12, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory / Pricing Tab (Upgraded) */}
        {activeTab === 'pricing' && (
          <div className="space-y-12 animate-fadeIn">
            <header>
              <h1 className="text-4xl font-bold text-white mb-2">{isRtl ? 'إدارة المنتجات' : 'Product Inventory'}</h1>
              <p className="text-gray-500 text-sm tracking-wide">{isRtl ? 'إضافة وتحديث مخزون المنتجات' : 'Add and monitor your product stock levels'}</p>
            </header>

            {/* Step 1: Add Product Form */}
            <div className="glass gold-border p-10 rounded-[40px] bg-[#1a1a1a]/40 shadow-2xl relative">
               {editingProduct && (
                 <button 
                   onClick={() => {
                     setEditingProduct(null);
                     setNewProduct({ category: 'oil', stock: 0, price: 0, nameKey: '' });
                     setPreviewImage(null);
                   }}
                   className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                 >
                   <X size={20} />
                 </button>
               )}
               <h2 className="text-xl font-bold uppercase tracking-widest text-gold-text mb-8 flex items-center gap-3">
                 {editingProduct ? <Edit3 size={20} /> : <Plus size={20} />} 
                 {editingProduct ? (isRtl ? 'تعديل المنتج' : 'Edit Product') : (isRtl ? 'إضافة منتج جديد' : 'New Product Entry')}
               </h2>
               
               <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Col: Upload Box */}
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em] block">{isRtl ? 'صورة المنتج' : 'Product Visual'}</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-video lg:aspect-square glass gold-border border-dashed border-2 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:bg-gold-text/5 transition-all overflow-hidden relative group"
                    >
                      {previewImage ? (
                        <img src={previewImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Preview" />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 gold-bg/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-text/30 group-hover:scale-110 transition-transform">
                            <Camera size={32} className="text-gold-text" />
                          </div>
                          <p className="text-sm font-bold text-white">{isRtl ? 'اضغط لرفع الصورة' : 'Click to Upload Image'}</p>
                          <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">JPG, PNG up to 5MB</p>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>
                  </div>

                  {/* Right Col: Text Inputs */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{isRtl ? 'اسم المنتج' : 'Product Name'}</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.nameKey}
                        onChange={e => setNewProduct({...newProduct, nameKey: e.target.value})}
                        placeholder={isRtl ? 'مثلاً: زيت زيتون بكر' : 'e.g. Premium Argan Oil'}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text transition-all text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{isRtl ? 'الفئة' : 'Category'}</label>
                        <select 
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text text-white appearance-none"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                        >
                          <option value="oil">{isRtl ? 'زيوت' : 'Oils'}</option>
                          <option value="amlou">{isRtl ? 'أملو' : 'Amlou'}</option>
                          <option value="honey">{isRtl ? 'عسل' : 'Honey'}</option>
                          <option value="food">{isRtl ? 'منتجات غذائية' : 'Food'}</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{isRtl ? 'السعر (درهم)' : 'Price (MAD)'}</label>
                        <input 
                          type="number" 
                          required
                          value={newProduct.price || ''}
                          onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">{isRtl ? 'الكمية المتوفرة' : 'Stock Quantity'}</label>
                      <input 
                        type="number" 
                        required
                        value={newProduct.stock || ''}
                        onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text text-white"
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-5 gold-bg text-black font-bold rounded-2xl shadow-gold hover:scale-[1.02] transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 mt-4"
                    >
                      <Save size={20} /> {editingProduct ? (isRtl ? 'تحديث المنتج' : 'Update Product') : (isRtl ? 'حفظ المنتج' : 'Save Product')}
                    </button>
                  </div>
               </form>
            </div>

            {/* Step 2: Inventory Table */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{isRtl ? 'قائمة الجرد' : 'Stock Inventory'}</h2>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text"
                    placeholder={isRtl ? 'البحث عن منتج...' : 'Search items...'}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-3 outline-none focus:border-gold-text transition-all text-sm"
                  />
                </div>
              </div>

              <div className="glass gold-border rounded-[32px] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#111] border-b border-white/5 text-[10px] uppercase font-bold text-gray-500">
                      <tr>
                        <th className="px-8 py-5">{isRtl ? 'المنتج' : 'Product'}</th>
                        <th className="px-8 py-5">{isRtl ? 'الفئة' : 'Category'}</th>
                        <th className="px-8 py-5">{isRtl ? 'السعر' : 'Price'}</th>
                        <th className="px-8 py-5">{isRtl ? 'الحالة' : 'Status'}</th>
                        <th className="px-8 py-5 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden gold-border border-gold-text/10 shrink-0">
                                <img src={product.image} className="w-full h-full object-cover" alt={product.nameKey} />
                              </div>
                              <span className="font-bold text-white">{product.nameKey}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-8 py-4 font-bold gold-text">
                            {product.price} MAD
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                {product.stock} {isRtl ? 'وحدة' : 'Units'}
                              </span>
                              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`} 
                                  style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex justify-center gap-3">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-3 bg-white/5 text-white hover:bg-gold-text hover:text-black rounded-xl transition-all"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders and Settings tabs handled similarly with upgraded styling */}
        {activeTab === 'orders' && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold">{isRtl ? 'إدارة الطلبيات' : 'Order List'}</h2>
            <div className="glass gold-border rounded-[32px] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#111] border-b border-white/10 text-[10px] uppercase font-bold text-gray-500">
                  <tr>
                    <th className="px-8 py-5">Order ID</th>
                    <th className="px-8 py-5">Customer</th>
                    <th className="px-8 py-5">Total</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-white/5">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs text-gold-text">{order.id}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-white">{order.customer}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{order.city}</p>
                      </td>
                      <td className="px-8 py-6 font-bold">{order.total} MAD</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${(statusMap as any)[order.status].color}`}>
                          { (statusMap as any)[order.status].label }
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className="p-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20"><CheckCircle size={14}/></button>
                          <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="p-2 bg-purple-500/10 text-purple-400 rounded-xl hover:bg-purple-500/20"><Truck size={14}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl animate-fadeIn space-y-12">
            <h2 className="text-3xl font-bold">{isRtl ? 'الإعدادات العامة' : 'Store Settings'}</h2>
            <div className="glass gold-border p-10 rounded-[40px] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Standard Shipping Fee</label>
                    <div className="relative">
                      <input type="number" value={shipping.standardFee} onChange={e => setShipping({...shipping, standardFee: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text transition-all text-xl font-bold" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gold-text font-bold">MAD</span>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Free Shipping Threshold</label>
                    <div className="relative">
                      <input type="number" value={shipping.freeThreshold} onChange={e => setShipping({...shipping, freeThreshold: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-gold-text transition-all text-xl font-bold" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gold-text font-bold">MAD</span>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => alert(isRtl ? 'تم تحديث الإعدادات بنجاح!' : 'Settings updated successfully!')}
                className="w-full py-5 gold-bg text-black font-bold rounded-2xl shadow-gold uppercase tracking-widest text-xs"
              >
                Update Configurations
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
