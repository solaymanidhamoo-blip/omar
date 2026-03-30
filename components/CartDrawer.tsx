
import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { CartItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  lang: Language;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, setCart, lang }) => {
  const t = TRANSLATIONS[lang] as any;
  const isRtl = lang === Language.AR;

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    const itemsList = cart.map(item => `- ${item.nameKey}: ${item.quantity} x ${item.price} MAD`).join('\n');
    const msg = `New Order from Izouran Bio:\n\n${itemsList}\n\nTotal: ${total} MAD`;
    window.open(`https://wa.me/212660111801?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`absolute inset-y-0 ${isRtl ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className={`w-screen max-w-md glass border-${isRtl ? 'r' : 'l'} border-gold-text/20 flex flex-col shadow-2xl animate-fadeIn`}>
          
          {/* Header */}
          <div className="px-6 py-8 border-b border-gold-text/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="gold-text" size={24} />
              <h2 className="text-xl font-bold uppercase tracking-widest text-white">{t.cart || (isRtl ? 'سلة التسوق' : 'Shopping Cart')}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto px-6 py-8 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-50">
                <div className="w-24 h-24 gold-bg/10 rounded-full flex items-center justify-center border border-gold-text/20">
                  <ShoppingBag size={40} className="gold-text" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white uppercase tracking-widest">{isRtl ? 'السلة فارغة' : 'Your cart is empty'}</p>
                  <p className="text-xs text-gray-500 mt-2">{isRtl ? 'ابدأ بإضافة بعض المنتجات الرائعة!' : 'Start adding some amazing products!'}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="px-8 py-3 gold-border text-gold-text rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold-text hover:text-black transition-all"
                >
                  {isRtl ? 'العودة للتسوق' : 'Continue Shopping'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 glass gold-border rounded-3xl group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.nameKey} />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wide">{t[item.nameKey] || item.nameKey}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 font-bold">{item.price} MAD</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-black/40 rounded-xl px-2 py-1 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-gold-text transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-gold-text transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="text-sm font-bold gold-text">{item.price * item.quantity} MAD</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-8 border-t border-gold-text/10 space-y-6 bg-black/40">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{isRtl ? 'المجموع الفرعي' : 'Subtotal'}</p>
                  <p className="text-3xl font-bold text-white">{total} <span className="text-sm">MAD</span></p>
                </div>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-lg">
                  {isRtl ? 'توصيل مجاني' : 'Free Shipping'}
                </p>
              </div>
              
              <button 
                onClick={handleCheckout}
                className="w-full py-5 gold-bg text-black font-bold rounded-2xl shadow-gold hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs"
              >
                {isRtl ? 'إتمام الطلب عبر واتساب' : 'Checkout via WhatsApp'}
                {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              
              <p className="text-[9px] text-center text-gray-600 uppercase tracking-widest">
                {isRtl ? 'تأكيد الطلب يتم عبر الواتساب لضمان أفضل خدمة' : 'Orders are confirmed via WhatsApp for the best service'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
