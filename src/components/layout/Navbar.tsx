import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sparkles, Menu, X, Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TAXONOMY_CATEGORIES } from '../../data/categories';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getCartCount = useStore((state) => state.getCartCount);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const setIsMatchmakerOpen = useStore((state) => state.setIsMatchmakerOpen);
  const setActiveCategory = useStore((state) => state.setActiveCategory);

  const cartCount = getCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${isScrolled
          ? 'py-2.5 bg-[#F8F6F0]/90 backdrop-blur-xl border-b border-[#C59B27]/30 shadow-md'
          : 'py-4 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Eden Leaf Brand Identity & Logo */}
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3.5 cursor-pointer group select-none"
            >
              {/* Logo Emblem - Frameless */}
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105 shrink-0 flex items-center justify-center">
                <img
                  src={`${import.meta.env.BASE_URL}edenleaf-logo-clean.png`}
                  alt="EdenLeaf Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <span className="font-cinzel text-xl sm:text-2xl tracking-[0.24em] text-[#0F2E1E] font-bold group-hover:text-[#C59B27] transition-colors">
                  EDENLEAF
                </span>
                <span className="text-[9px] tracking-[0.28em] uppercase text-[#4B6E4A] font-mono font-semibold">
                  Botanicals • Landscaping • Nursery
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-white/70 p-1.5 rounded-full border border-[#C59B27]/30 backdrop-blur-md shadow-sm">
              <button
                onClick={() => scrollToSection('catalog')}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F2E1E] hover:text-[#C59B27] hover:bg-[#F8F6F0] transition-all"
              >
                Catalog (46)
              </button>
              <button
                onClick={() => {
                  setActiveCategory('flowers');
                  scrollToSection('catalog');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F2E1E] hover:text-[#C59B27] hover:bg-[#F8F6F0] transition-all"
              >
                Flowers
              </button>
              <button
                onClick={() => {
                  setActiveCategory('foliage-herbs');
                  scrollToSection('catalog');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F2E1E] hover:text-[#C59B27] hover:bg-[#F8F6F0] transition-all"
              >
                Foliage & Herbs
              </button>
              <button
                onClick={() => {
                  setActiveCategory('indoors-succulents');
                  scrollToSection('catalog');
                }}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F2E1E] hover:text-[#C59B27] hover:bg-[#F8F6F0] transition-all"
              >
                Indoors & Succulents
              </button>
              <button
                onClick={() => scrollToSection('nursery-story')}
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0F2E1E] hover:text-[#C59B27] hover:bg-[#F8F6F0] transition-all"
              >
                Conservatory
              </button>
            </nav>

            {/* Right Actions & Matchmaker */}
            <div className="flex items-center gap-3">
              {/* Matchmaker Trigger Button */}
              <button
                onClick={() => setIsMatchmakerOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] text-xs font-bold tracking-wider uppercase shadow-sm transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0F2E1E]" />
                <span>Plant Matchmaker</span>
              </button>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full bg-white/80 hover:bg-white border border-[#C59B27]/40 text-[#0F2E1E] hover:text-[#C59B27] transition-all shadow-sm group"
                aria-label="Open Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#C59B27] text-[#0F2E1E] text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-white/80 border border-[#C59B27]/30 text-[#0F2E1E]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F8F6F0]/98 backdrop-blur-2xl lg:hidden pt-24 px-6 flex flex-col justify-between pb-8">
          <div className="space-y-4">
            <div className="pb-3 border-b border-[#C59B27]/25 flex items-center gap-3">
              <img src={`${import.meta.env.BASE_URL}edenleaf-logo-clean.png`} alt="EdenLeaf" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-cinzel text-lg font-bold tracking-[0.2em] text-[#0F2E1E]">EDENLEAF</span>
                <p className="text-[10px] text-[#4B6E4A] uppercase tracking-widest font-mono">Growing Beauty, Naturally</p>
              </div>
            </div>

            <p className="text-xs font-mono uppercase tracking-widest text-[#4B6E4A] mb-2">Botanical Taxonomies</p>
            {TAXONOMY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection('catalog');
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/80 border border-[#C59B27]/25 flex items-center justify-between text-[#0F2E1E] hover:bg-[#C59B27]/10 transition-colors"
              >
                <span className="font-semibold text-sm">{cat.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#C59B27]/20 text-[#0F2E1E] font-mono font-bold">
                  {cat.count}
                </span>
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsMatchmakerOpen(true);
              }}
              className="w-full mt-4 py-3 rounded-xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Launch Plant Matchmaker
            </button>
          </div>

          <div className="border-t border-[#C59B27]/25 pt-4 flex items-center justify-between text-xs text-[#4B6E4A]">
            <span>Direct WhatsApp Concierge</span>
            <span className="font-mono text-[#0F2E1E] font-bold">+1 (555) 019-2834</span>
          </div>
        </div>
      )}
    </>
  );
};
