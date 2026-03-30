
import React from 'react';
import { ShoppingCart, Lock, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  setLang: (l: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang, cartCount, onOpenCart }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gold-text/20 py-4 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* محول اللغة */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {[Language.AR, Language.EN, Language.FR].map(l => (
            <button 
              key={l} 
              onClick={() => setLang(l)} 
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${lang === l ? 'gold-bg text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* الشعار */}
        <Link to="/" className="group">
          <h1 className="text-2xl md:text-3xl font-bold gold-text tracking-[0.3em] uppercase group-hover:scale-105 transition-transform">Izouran</h1>
          <div className="h-[1px] w-0 group-hover:w-full gold-bg transition-all duration-500"></div>
        </Link>

        {/* الأدوات */}
        <div className="flex items-center gap-4">
           <Link to="/admin" className="p-2 text-gray-500 hover:text-gold-text transition-colors" title="Admin Portal">
              <Lock size={20} />
           </Link>
           <div 
             onClick={onOpenCart}
             className="relative p-2 gold-border rounded-xl cursor-pointer hover:bg-gold-text/10 transition-colors"
           >
              <ShoppingCart size={20} className="gold-text" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 gold-bg text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-lg">
                  {cartCount}
                </span>
              )}
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
