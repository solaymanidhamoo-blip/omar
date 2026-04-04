
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Language, Product } from '../types';
import { TRANSLATIONS } from '../constants';
import ReviewsSection from '../ReviewsSection';

interface HomeProps {
  lang: Language;
  products: Product[];
  onAddToCart: (p: Product, q: number, w: string) => void;
}

const Home: React.FC<HomeProps> = ({ lang, products, onAddToCart }) => {
  const t = TRANSLATIONS[lang] as any;
  const isRtl = lang === Language.AR;

  const scrollToProducts = () => {
    const element = document.getElementById('product-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, p: Product) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(p, 1, '1L');
  };

  return (
    <main className="pt-32 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center py-48 px-6 relative overflow-hidden min-h-[80vh] flex items-center justify-center">
         <div className="absolute inset-0 w-full h-full z-10 overflow-hidden pointer-events-none bg-black">
            <iframe
               src="https://www.youtube.com/embed/iYuYjIdNI3E?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=iYuYjIdNI3E&vq=hd1080"
               className="absolute w-[300vw] h-[300vh] md:w-[150vw] md:h-[150vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
               frameBorder="0"
               allow="autoplay; encrypted-media"
               allowFullScreen
            ></iframe>
         </div>
         <div className="absolute inset-0 z-20 bg-black/50"></div>
         <div className="max-w-4xl mx-auto relative z-30">
            <h2 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter text-white drop-shadow-2xl">{t.heroTitle}</h2>
            <p className="text-xl md:text-2xl gold-text opacity-90 mb-14 font-medium drop-shadow-lg">{t.heroSubtitle}</p>
            <button 
              onClick={scrollToProducts}
              className="gold-bg text-black px-14 py-5 rounded-full font-bold shadow-gold hover:scale-105 transition-transform uppercase tracking-widest text-xs"
            >
               {t.discoverProducts}
            </button>
         </div>
      </section>

      {/* Product Grid */}
      <section id="product-grid" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-6 pb-32">
        {products.map(p => (
          <Link 
            key={p.id} 
            to={`/product/${p.id}`}
            className="glass gold-border rounded-[45px] overflow-hidden group hover:translate-y-[-10px] transition-all duration-500 shadow-2xl"
          >
            <div className="h-80 overflow-hidden relative">
               <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={t[p.nameKey]} />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-10">
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:gold-text transition-colors">{t[p.nameKey]}</h3>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Premium Grade</p>
                  <p className="text-3xl font-bold gold-text">{p.price} <span className="text-sm">MAD</span></p>
                </div>
                <button 
                  onClick={(e) => handleQuickAdd(e, p)}
                  className="w-14 h-14 gold-bg text-black rounded-3xl flex items-center justify-center shadow-gold hover:scale-110 active:scale-95 transition-transform z-10"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <ReviewsSection lang={lang} />
    </main>
  );
};

export default Home;
