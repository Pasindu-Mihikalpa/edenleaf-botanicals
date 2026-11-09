import React from 'react';
import { Sparkles, HeartHandshake, Leaf, Sprout } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GreenhouseStory: React.FC = () => {
  const setIsMatchmakerOpen = useStore((state) => state.setIsMatchmakerOpen);

  return (
    <section id="nursery-story" className="relative z-20 py-24 px-4 sm:px-6 lg:px-8 bg-[#0A1C13] text-[#F8F6F0] overflow-hidden border-t border-[#C59B27]/30">
      {/* Decorative Golden Line */}
      <div className="w-24 h-1 bg-gradient-to-r from-[#DFB847] via-[#C59B27] to-[#9A771C] mx-auto rounded-full mb-14 opacity-80" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Atmospheric Greenhouse Imagery Grid */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
          <div className="space-y-4">
            <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#05130D] border border-[#C59B27]/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80"
                alt="Greenhouse interior"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="p-4 rounded-2xl glass-card-dark">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#C59B27] block font-bold">Micro-Climate Conservatory</span>
              <span className="text-xs font-bold text-white">72°F Constant • 68% Ambient Humidity</span>
            </div>
          </div>

          <div className="space-y-4 pt-8">
            <div className="p-4 rounded-2xl glass-card-dark">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#4B6E4A] block font-bold">Cultivation Substrate</span>
              <span className="text-xs font-bold text-white">Triple-Washed Coconut Coir & Biochar</span>
            </div>
            <div className="rounded-3xl overflow-hidden aspect-[3/4] bg-[#05130D] border border-[#C59B27]/30 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80"
                alt="Heirloom seedlings"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Narrative Storytelling */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-[#C59B27]/40 text-[#DFB847] text-xs font-mono uppercase tracking-widest font-bold">
            <Leaf className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Living Architecture Philosophy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Rooted in Science,{' '}
            <span className="italic font-normal gold-gradient-text">Nurtured</span> with Artistry.
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/80 font-light leading-relaxed">
            Eden Leaf Botanicals began as an experimental botanical glasshouse focused on resurrecting heritage flora, cultivating pest-free indoor aroids, designing living landscapes, and engineering mineral-rich soil substrates that eliminate transplant shock.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl glass-card-dark space-y-2">
              <div className="flex items-center gap-2 text-[#C59B27] text-sm font-bold">
                <Sprout className="w-4 h-4 text-[#C59B27]" />
                <span>Zero-Chemical Hardening</span>
              </div>
              <p className="text-xs text-emerald-200/70 font-light">
                Every specimen undergoes an 18-day environmental acclimatization cycle before dispatch, preventing yellowing leaves.
              </p>
            </div>

            <div className="p-4 rounded-2xl glass-card-dark space-y-2">
              <div className="flex items-center gap-2 text-[#C59B27] text-sm font-bold">
                <HeartHandshake className="w-4 h-4 text-[#C59B27]" />
                <span>WhatsApp Plant Doctor</span>
              </div>
              <p className="text-xs text-emerald-200/70 font-light">
                Direct WhatsApp access to our greenhouse horticulturists for lifetime diagnostics, repotting advice, and feeding ratios.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setIsMatchmakerOpen(true)}
              className="px-7 py-3.5 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-glow-gold hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F2E1E]" />
              <span>Let our Matchmaker choose for you</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
