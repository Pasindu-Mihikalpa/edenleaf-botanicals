import React from 'react';
import { Mail, MapPin, Clock, ArrowUp, MessageSquare, ShieldCheck } from 'lucide-react';
import { TAXONOMY_CATEGORIES } from '../../data/categories';
import { useStore } from '../../store/useStore';

export const Footer: React.FC = () => {
  const setActiveCategory = useStore((state) => state.setActiveCategory);
  const dispatchPhone = useStore((state) => state.dispatchPhone);
  const dispatchEmail = useStore((state) => state.dispatchEmail);
  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);
  const setIsPasskeyModalOpen = useStore((state) => state.setIsPasskeyModalOpen);
  const setCurrentView = useStore((state) => state.setCurrentView);

  const scrollToCatalogWithCategory = (catId: any) => {
    setActiveCategory(catId);
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 bg-[#0A1C13] border-t border-[#C59B27]/30 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-[#F8F6F0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A4D34]/50">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              {/* Logo Emblem - Frameless */}
              <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                <img src={`${import.meta.env.BASE_URL}edenleaf-logo-clean.png`} alt="EdenLeaf" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-cinzel text-2xl font-bold text-white tracking-[0.22em] block">
                  EDENLEAF
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#C59B27] font-mono block font-bold">
                  Botanicals • Landscaping • Nursery
                </span>
              </div>
            </div>

            <p className="text-xs italic text-[#DFB847] font-serif font-medium">
              "Growing Beauty, Naturally"
            </p>

            <p className="text-sm text-emerald-100/70 max-w-sm leading-relaxed font-light">
              Artisanal greenhouse cultivation of heritage flora, architectural cut flowers, landscape nursery stock, forged tools, and scientific soil substrates.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${dispatchPhone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-[#0A1C13] font-bold text-xs flex items-center gap-2 transition-all duration-300 shadow-sm hover:brightness-110"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Nursery Concierge</span>
              </a>
            </div>
          </div>

          {/* Catalog Taxonomies */}
          <div className="space-y-3">
            <h4 className="text-xs font-cinzel uppercase tracking-widest text-[#DFB847] font-bold">
              Flowers & Foliage
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              {TAXONOMY_CATEGORIES.slice(0, 2).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollToCatalogWithCategory(cat.id)}
                    className="hover:text-[#C59B27] transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Supplies & Equipment */}
          <div className="space-y-3">
            <h4 className="text-xs font-cinzel uppercase tracking-widest text-[#DFB847] font-bold">
              Indoors & Orchard
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80 font-medium">
              {TAXONOMY_CATEGORIES.slice(2, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => scrollToCatalogWithCategory(cat.id)}
                    className="hover:text-[#C59B27] transition-colors"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Greenhouse Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-cinzel uppercase tracking-widest text-[#DFB847] font-bold">
              Conservatory Hours
            </h4>
            <div className="space-y-2 text-xs text-emerald-100/80 font-light">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C59B27] shrink-0 mt-0.5" />
                <span>Mon – Sat: 8:00 AM – 6:30 PM<br />Sunday: 9:00 AM – 4:00 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0 mt-0.5" />
                <span>EdenLeaf Conservatory, Botanical Mile</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span className="font-mono text-white font-bold">{dispatchEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/70 gap-4">
          <p>
            <span
              onClick={() => setIsPasskeyModalOpen(true)}
              className="cursor-default select-none hover:text-[#DFB847] transition-colors"
              title=""
            >
              ©
            </span>{' '}
            {new Date().getFullYear()} Eden Leaf Botanicals. Growing Beauty, Naturally. All Rights Reserved.
          </p>

          <div className="flex items-center gap-5">
            {isAdminAuthenticated && (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 text-xs text-[#C59B27] hover:text-[#DFB847] transition-colors font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Terminal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#DFB847] hover:text-white transition-colors font-bold"
            >
              <span>Back to Summit</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
