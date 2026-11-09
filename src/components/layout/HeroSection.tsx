import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Droplets, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '../../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const setIsMatchmakerOpen = useStore((state) => state.setIsMatchmakerOpen);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // GSAP ScrollTrigger Curtain Upward Slide Transition
  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -35,
        opacity: 0.35,
        scale: 0.96,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero-section"
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#F8F6F0] text-[#0F2E1E] will-change-transform z-10"
    >
      {/* ----------------------------------------------------------------- */}
      {/* FULL-WIDTH IMMERSIVE BOTANICAL BACKGROUND IMAGE                   */}
      {/* ----------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <img
          src={`${import.meta.env.BASE_URL}hero-bg.jpg`}
          alt="Eden Leaf Luxury Botanical Interior"
          className="w-full h-full object-cover object-center scale-100"
        />
        {/* Subtle Warm Ivory & Gold Ambient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F6F0]/40 via-transparent to-[#F8F6F0]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,transparent_75%)]" />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* STRICTLY CENTER-ALIGNED FOREGROUND CONTENT                        */}
      {/* ----------------------------------------------------------------- */}
      <div
        ref={contentRef}
        id="hero-content"
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center py-28 flex flex-col items-center justify-center space-y-8"
      >
        {/* EdenLeaf Official Brand Logo - Frameless */}
        <div className="flex flex-col items-center justify-center -mb-2">
          <img
            src={`${import.meta.env.BASE_URL}edenleaf-logo-clean.png`}
            alt="EdenLeaf Botanicals"
            className="w-32 sm:w-40 md:w-48 h-auto object-contain hover:scale-105 transition-transform duration-500 select-none drop-shadow-sm"
          />
        </div>

        {/* Curated Botanical Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 border border-[#C59B27]/40 backdrop-blur-md shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-ping" />
          <span className="text-[11px] sm:text-xs uppercase font-mono tracking-[0.26em] text-[#0F2E1E] font-bold">
            Botanicals • Landscaping • Nursery
          </span>
        </div>

        {/* Main Central Headline */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-[#0F2E1E] drop-shadow-sm">
            Growing Beauty,{' '}
            <span className="italic font-normal gold-gradient-text">Naturally.</span>
          </h1>
          <p className="font-cinzel text-xs sm:text-sm md:text-base tracking-[0.32em] text-[#4B6E4A] uppercase font-bold">
            Living Architecture, Specimen Flora & Precision Substrates
          </p>
        </div>

        {/* Center-Aligned CTAs Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md mx-auto">
          <button
            onClick={scrollToCatalog}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-widest shadow-glow-gold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group"
          >
            <span>Explore Full Catalog (46)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={() => setIsMatchmakerOpen(true)}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/90 hover:bg-white text-[#0F2E1E] font-bold text-xs uppercase tracking-wider border border-[#C59B27]/50 hover:border-[#DFB847] backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2.5 shadow-sm group"
          >
            <Sparkles className="w-4 h-4 text-[#C59B27] group-hover:rotate-12 transition-transform" />
            <span>Plant Matchmaker (5-Steps)</span>
          </button>
        </div>

        {/* Centered Micro-Trust Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[#C59B27]/30 w-full max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5 text-[#0F2E1E] text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
              <span>100% Organic</span>
            </div>
            <p className="text-[11px] text-[#4B6E4A] font-medium">Certified greenhouse stock</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5 text-[#0F2E1E] text-xs font-bold">
              <Truck className="w-4 h-4 text-[#C59B27]" />
              <span>White Glove</span>
            </div>
            <p className="text-[11px] text-[#4B6E4A] font-medium">Direct courier dispatch</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-1">
            <div className="flex items-center gap-1.5 text-[#0F2E1E] text-xs font-bold">
              <Droplets className="w-4 h-4 text-[#C59B27]" />
              <span>Landscaping</span>
            </div>
            <p className="text-[11px] text-[#4B6E4A] font-medium">Bespoke living design</p>
          </div>
        </div>

        {/* Scroll Indicator Curtain Hint */}
        <div
          onClick={scrollToCatalog}
          className="pt-8 flex flex-col items-center gap-2 cursor-pointer group opacity-85 hover:opacity-100 transition-opacity"
        >
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#C59B27] font-bold">
            Scroll to Reveal Living Catalog
          </span>
          <ChevronDown className="w-4 h-4 text-[#0F2E1E] animate-bounce" />
        </div>
      </div>
    </section>
  );
};
