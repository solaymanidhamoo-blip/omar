
import React from 'react';
import { Link } from 'react-router-dom';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] as any;
  
  return (
    <footer className="py-20 glass border-t border-gold-text/10 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-bold gold-text tracking-[0.3em] uppercase mb-4">Izouran Bio</h2>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-8">© 2026 Crafted for Health & Tradition</p>
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
             <Link to="/" className="hover:text-gold-text transition-colors">{t.home}</Link>
             <a href="#" className="hover:text-gold-text transition-colors">{t.heritage}</a>
             <a href="#" className="hover:text-gold-text transition-colors">{t.contact}</a>
          </div>
          <Link to="/admin" className="text-[10px] font-bold text-gold-text/20 hover:text-gold-text transition-colors uppercase tracking-[0.5em] mt-4">
            Command Center Access
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
