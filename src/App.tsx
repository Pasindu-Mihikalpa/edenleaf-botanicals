import React, { useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/layout/HeroSection';
import { CatalogSection } from './components/catalog/CatalogSection';
import { GreenhouseStory } from './components/layout/GreenhouseStory';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { OrderDispatchModal } from './components/order/OrderDispatchModal';
import { PlantMatchmakerModal } from './components/matchmaker/PlantMatchmakerModal';
import { QuickViewModal } from './components/catalog/QuickViewModal';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from './store/useStore';
import { fetchCloudProducts } from './lib/supabase';

export const App: React.FC = () => {
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const setIsMatchmakerOpen = useStore((state) => state.setIsMatchmakerOpen);
  const getCartCount = useStore((state) => state.getCartCount);
  const setProducts = useStore((state) => state.resetCatalog);

  const cartCount = getCartCount();

  // On initial mount, sync live catalog from Supabase cloud database if configured
  useEffect(() => {
    fetchCloudProducts().then((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        useStore.setState({ products: cloudProducts });
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-[#F8F6F0] text-[#0F2E1E] overflow-x-hidden selection:bg-[#C59B27] selection:text-[#0F2E1E]">
      {/* ------------------------------------------------------------- */}
      {/* FOREGROUND UI LAYER (Z-20)                                    */}
      {/* ------------------------------------------------------------- */}
      <Navbar />

      <main className="relative z-20">
        <HeroSection />
        <CatalogSection />
        <GreenhouseStory />
      </main>

      <Footer />

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ACTION DOCKS (Z-30)                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Quick Matchmaker Floating Pill */}
        <button
          onClick={() => setIsMatchmakerOpen(true)}
          className="p-3.5 rounded-full bg-[#0A1C13] hover:bg-[#05130D] text-[#DFB847] border border-[#C59B27]/40 backdrop-blur-xl shadow-glow-gold hover:scale-110 transition-all duration-300 group"
          title="Open Plant Matchmaker"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Floating Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative p-3.5 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] shadow-md hover:scale-110 transition-all duration-300 group font-bold"
          title="Open Shopping Cart"
        >
          <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-[#0F2E1E] text-white text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-bounce">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* OVERLAY & MODAL LAYER (Z-50)                                  */}
      {/* ------------------------------------------------------------- */}
      <CartDrawer />
      <OrderDispatchModal />
      <PlantMatchmakerModal />
      <QuickViewModal />
    </div>
  );
};

export default App;
