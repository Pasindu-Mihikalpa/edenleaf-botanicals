import React, { useState } from 'react';
import { LayoutDashboard, Layers, ShoppingBag, ArrowLeft, LogOut, DollarSign, PackageCheck, AlertTriangle, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { AdminInventoryTable } from './AdminInventoryTable';
import { AdminOrdersTable } from './AdminOrdersTable';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const setCurrentView = useStore((state) => state.setCurrentView);
  const logoutAdmin = useStore((state) => state.logoutAdmin);
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);

  // Compute KPI Metrics
  const grossRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Dispatched').length;
  const outOfStockCount = products.filter((p) => p.stockCount === 0).length;

  return (
    <div className="min-h-screen bg-[#0A1C13] text-[#F8F6F0] flex flex-col md:flex-row">
      {/* ----------------------------------------------------------------- */}
      {/* OBSIDIAN EVERGREEN COLLAPSIBLE SIDEBAR                            */}
      {/* ----------------------------------------------------------------- */}
      <aside className="w-full md:w-64 bg-[#05130D] border-r border-[#C59B27]/30 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Emblem - Frameless */}
          <div className="flex items-center gap-3 pb-5 border-b border-[#1A4D34]/50">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}edenleaf-logo-clean.png`} alt="EdenLeaf" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold tracking-[0.2em] text-white block">
                EDENLEAF
              </span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#C59B27] block font-bold">
                Admin Control Terminal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#C59B27] text-[#0F2E1E] shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-[#1A4D34]/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview HUD</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#C59B27] text-[#0F2E1E] shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-[#1A4D34]/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Inventory CRUD</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#C59B27] text-[#0F2E1E] shadow-sm'
                  : 'text-emerald-200 hover:text-white hover:bg-[#1A4D34]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Order Center</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-[#0F2E1E] text-white' : 'bg-[#C59B27] text-[#0F2E1E]'
                }`}>
                  {activeOrdersCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-6 border-t border-[#1A4D34]/50 mt-6">
          <button
            onClick={() => setCurrentView('storefront')}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-200 hover:text-white hover:bg-[#1A4D34]/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#C59B27]" />
            <span>Return to Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Logout</span>
          </button>
        </div>
      </aside>

      {/* ----------------------------------------------------------------- */}
      {/* MAIN OPERATIONS DASHBOARD WORKSPACE                              */}
      {/* ----------------------------------------------------------------- */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top KPI Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#05130D] border border-[#C59B27]/30 p-5 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span>Gross Order Value</span>
              <DollarSign className="w-4 h-4 text-[#DFB847]" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#DFB847]">
              ${grossRevenue.toFixed(2)}
            </div>
            <span className="text-[10px] text-emerald-400 block font-light">
              Across all dispatched manifests
            </span>
          </div>

          <div className="bg-[#05130D] border border-[#C59B27]/30 p-5 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span>Active Orders Queue</span>
              <PackageCheck className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {activeOrdersCount} Pending
            </div>
            <span className="text-[10px] text-[#4B6E4A] block font-light">
              Needs greenhouse packaging
            </span>
          </div>

          <div className="bg-[#05130D] border border-[#C59B27]/30 p-5 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span>Catalog Cultivars</span>
              <Sparkles className="w-4 h-4 text-[#DFB847]" />
            </div>
            <div className="font-mono text-2xl font-bold text-white">
              {products.length} Varieties
            </div>
            <span className="text-[10px] text-emerald-400 block font-light">
              Live on storefront catalog
            </span>
          </div>

          <div className="bg-[#05130D] border border-[#C59B27]/30 p-5 rounded-3xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
              <span>Stock Out Alerts</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="font-mono text-2xl font-bold text-rose-300">
              {outOfStockCount} Out of Stock
            </div>
            <span className="text-[10px] text-rose-400/80 block font-light">
              Marked 'Sold Out' on store
            </span>
          </div>
        </div>

        {/* Tab View Switching */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-[#05130D] border border-[#C59B27]/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1A4D34] flex items-center justify-center text-[#DFB847]">
                  <ShieldCheck className="w-6 h-6 text-[#DFB847]" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">
                    Greenhouse Terminal Overview
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    Real-time command center for Eden Leaf Botanicals inventory and order routing.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div
                  onClick={() => setActiveTab('inventory')}
                  className="p-5 rounded-2xl bg-[#0A1C13] border border-[#C59B27]/25 hover:border-[#DFB847] cursor-pointer transition-all group"
                >
                  <h4 className="font-serif font-bold text-white group-hover:text-[#DFB847] transition-colors flex items-center justify-between">
                    <span>Manage Inventory & Pricing</span>
                    <Layers className="w-4 h-4 text-[#C59B27]" />
                  </h4>
                  <p className="text-xs text-emerald-100/70 mt-1 font-light">
                    Adjust stock quantities inline, modify retail prices, or publish new rare cultivars to the 6-tier storefront.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab('orders')}
                  className="p-5 rounded-2xl bg-[#0A1C13] border border-[#C59B27]/25 hover:border-[#DFB847] cursor-pointer transition-all group"
                >
                  <h4 className="font-serif font-bold text-white group-hover:text-[#DFB847] transition-colors flex items-center justify-between">
                    <span>View Customer Orders</span>
                    <ShoppingBag className="w-4 h-4 text-[#C59B27]" />
                  </h4>
                  <p className="text-xs text-emerald-100/70 mt-1 font-light">
                    Monitor incoming WhatsApp and Email orders, toggle delivery lifecycle status, and send pre-filled updates with one tap.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-white">
                  Recent Dispatch Manifests
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#DFB847] hover:underline font-mono"
                >
                  View All Orders →
                </button>
              </div>
              <AdminOrdersTable />
            </div>
          </div>
        )}

        {activeTab === 'inventory' && <AdminInventoryTable />}
        {activeTab === 'orders' && <AdminOrdersTable />}
      </main>
    </div>
  );
};
