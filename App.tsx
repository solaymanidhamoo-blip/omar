
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Language, Product, CartItem } from './types';
import { PRODUCTS } from './constants';

// Modular Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import ProductDetails from './ProductDetails';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './pages/AdminLogin';

/**
 * PublicLayout: Wraps consumer-facing pages with the shared Header and Footer.
 * Does NOT include the Admin Login screen.
 */
const PublicLayout: React.FC<{
  lang: Language;
  setLang: (l: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  children: React.ReactNode;
}> = ({ lang, setLang, cartCount, onOpenCart, children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} setLang={setLang} cartCount={cartCount} onOpenCart={onOpenCart} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer lang={lang} />
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/212660111801" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="wa-playstore-icon" 
        aria-label="Contact on WhatsApp"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
};

/**
 * ProductDetailsWrapper: Helper to extract params and find the product for the details page.
 */
const ProductDetailsWrapper: React.FC<{
  lang: Language;
  products: Product[];
  onAddToCart: (p: Product, q: number, w: string) => void;
}> = ({ lang, products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  if (!product) return <Navigate to="/" replace />;

  return (
    <ProductDetails 
      product={product} 
      lang={lang} 
      onClose={() => navigate('/')} 
      onAddToCart={onAddToCart} 
    />
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.AR);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [products] = useState<Product[]>(PRODUCTS);

  const isRtl = lang === Language.AR;

  // Check session on load
  useEffect(() => {
    const savedAdmin = sessionStorage.getItem('izouran_admin');
    if (savedAdmin === 'true') setIsAdmin(true);
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('izouran_admin', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('izouran_admin');
  };

  const handleAddToCart = (p: Product, qty: number, weight: string) => {
    const cartId = `${p.id}-${weight}`;
    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) return prev.map(item => item.id === cartId ? { ...item, quantity: item.quantity + qty } : item);
      return [...prev, { ...p, id: cartId, quantity: qty }];
    });
    setIsCartOpen(true);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Router>
      <div className={`min-h-screen bg-black text-white ${isRtl ? 'font-arabic' : 'font-latin'}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <Routes>
          {/* Consumer Routes - Wrapped in PublicLayout */}
          <Route path="/" element={
            <PublicLayout lang={lang} setLang={setLang} cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)}>
              <Home lang={lang} products={products} onAddToCart={handleAddToCart} />
            </PublicLayout>
          } />
          
          <Route path="/product/:id" element={
            <PublicLayout lang={lang} setLang={setLang} cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)}>
              <ProductDetailsWrapper lang={lang} products={products} onAddToCart={handleAddToCart} />
            </PublicLayout>
          } />

          {/* Admin Routes - COMPLETELY ISOLATED from public layout */}
          <Route 
            path="/admin" 
            element={
              isAdmin ? (
                <AdminDashboard lang={lang} onExit={handleAdminLogout} />
              ) : (
                <AdminLogin onLogin={handleAdminLogin} />
              )
            } 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          setCart={setCart} 
          lang={lang} 
        />
      </div>
    </Router>
  );
};

export default App;
