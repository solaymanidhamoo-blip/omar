
import React, { useState, useMemo } from 'react';
import { Language, Product, CartItem } from './types';
import { TRANSLATIONS } from './constants';

interface ProductDetailsProps {
  product: Product;
  lang: Language;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number, weight: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, lang, onClose, onAddToCart }) => {
  const t = TRANSLATIONS[lang] as any;
  const isRtl = lang === Language.AR;

  const [selectedWeight, setSelectedWeight] = useState('1kg');
  const [quantity, setQuantity] = useState(1);

  const weights = [
    { label: '1kg', multiplier: 1 },
    { label: '500g', multiplier: 0.6 },
    { label: '250g', multiplier: 0.35 }
  ];

  const currentPrice = useMemo(() => {
    const weight = weights.find(w => w.label === selectedWeight);
    return Math.round(product.price * (weight?.multiplier || 1));
  }, [selectedWeight, product.price]);

  const oldPrice = Math.round(currentPrice * 1.25);

  const handleBuyNow = () => {
    const msg = `Order from Izouran Bio:\nProduct: ${t[product.nameKey]}\nWeight: ${selectedWeight}\nQuantity: ${quantity}\nTotal: ${currentPrice * quantity} MAD`;
    window.open(`https://wa.me/212660111801?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black overflow-y-auto ${isRtl ? 'font-arabic' : 'font-latin'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Navigation Header */}
      <nav className="sticky top-0 z-10 glass border-b border-gold-text/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onClose} className="flex items-center gap-2 text-gold-text hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
             <span className={isRtl ? 'rotate-180' : ''}>←</span> {t.back}
          </button>
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hidden md:block">
            {t.home} &gt; {product.category === 'oil' ? (isRtl ? 'زيوت' : 'Oils') : (isRtl ? 'منتجات غذائية' : 'Food')} &gt; <span className="text-gold-text">{t[product.nameKey]}</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Side: Large Product Image */}
          <div className="animate-fadeIn">
            <div className="glass gold-border rounded-[40px] overflow-hidden aspect-square shadow-2xl group">
              <img 
                src={product.image} 
                alt={t[product.nameKey]} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>

          {/* Right Side: Product Details */}
          <div className="space-y-10 animate-slideInRight">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
                {t[product.nameKey]}
              </h1>
              <p className="text-xl gold-text font-medium italic opacity-80">
                {t[product.descKey]}
              </p>
            </div>

            <div className="flex items-end gap-6 border-y border-white/5 py-8">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 line-through mb-1">{oldPrice} MAD</span>
                <span className="text-5xl font-bold gold-text">{currentPrice} <span className="text-lg">MAD</span></span>
              </div>
              <div className="bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold mb-1">
                 -25% OFF
              </div>
            </div>

            {/* Weight Selector */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t.weight}</p>
              <div className="flex flex-wrap gap-4">
                {weights.map(w => (
                  <button
                    key={w.label}
                    onClick={() => setSelectedWeight(w.label)}
                    className={`px-8 py-3 rounded-xl border font-bold transition-all ${
                      selectedWeight === w.label 
                        ? 'gold-bg text-black border-gold-text shadow-gold' 
                        : 'border-white/10 text-gray-400 hover:border-gold-text/30'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Counter */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">{t.quantity}</p>
              <div className="flex items-center gap-6 glass gold-border w-fit px-6 py-2 rounded-2xl">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-2xl text-gold-text hover:text-white transition-colors"
                >
                  −
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-2xl text-gold-text hover:text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button 
                onClick={() => onAddToCart(product, quantity, selectedWeight)}
                className="py-5 gold-bg text-black font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-gold uppercase tracking-widest text-xs"
              >
                {t.addToCart}
              </button>
              <button 
                onClick={handleBuyNow}
                className="py-5 bg-[#25D366] text-white font-bold rounded-2xl hover:scale-[1.02] transition-all shadow-lg uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                {t.buyNow}
              </button>
            </div>

            {/* Social Share */}
            <div className="pt-10 flex items-center gap-6">
               <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{t.share}</span>
               <div className="flex gap-4">
                  {[
                    { id: 'whatsapp', icon: '📱', url: `https://wa.me/?text=${encodeURIComponent(window.location.href)}` },
                    { id: 'facebook', icon: 'f', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
                    { id: 'instagram', icon: '📸', url: `https://instagram.com` }
                  ].map(platform => (
                    <button 
                      key={platform.id} 
                      onClick={() => window.open(platform.url, '_blank')}
                      className="w-10 h-10 rounded-full glass gold-border flex items-center justify-center hover:gold-bg hover:text-black transition-all"
                    >
                       <span className="text-xs">{platform.icon}</span>
                    </button>
                  ))}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
