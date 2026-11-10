import React, { useState } from 'react';
import { Lock, KeyRound, X, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const AdminPasskeyModal: React.FC = () => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState(false);

  const isPasskeyModalOpen = useStore((state) => state.isPasskeyModalOpen);
  const setIsPasskeyModalOpen = useStore((state) => state.setIsPasskeyModalOpen);
  const loginAdmin = useStore((state) => state.loginAdmin);
  const currentView = useStore((state) => state.currentView);
  const isAdminAuthenticated = useStore((state) => state.isAdminAuthenticated);
  const setCurrentView = useStore((state) => state.setCurrentView);

  if (!isPasskeyModalOpen) return null;

  const handleClose = () => {
    setIsPasskeyModalOpen(false);
    if (currentView === 'admin' && !isAdminAuthenticated) {
      setCurrentView('storefront');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passkey);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
    } else {
      setPasskey('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl transition-opacity animate-in fade-in"
      />

      {/* Modal in Obsidian Evergreen (#0A1C13) */}
      <div className="relative w-full max-w-md bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl overflow-hidden shadow-2xl z-10 p-7 animate-in zoom-in-95 duration-300 text-[#F8F6F0]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#05130D] border border-[#C59B27]/40 mx-auto flex items-center justify-center text-[#DFB847] shadow-glow-gold">
            <Lock className="w-6 h-6 text-[#DFB847]" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C59B27] block font-bold">
              Restricted Terminal
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">
              Admin Access Gate
            </h2>
            <p className="text-xs text-emerald-100/70 mt-1 font-light">
              Enter the greenhouse master passkey to access inventory CRUD and order dispatch controls.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter passkey (e.g. eden2026)"
                autoFocus
                className={`w-full pl-10 pr-4 py-3 rounded-2xl bg-[#05130D] border text-sm text-white placeholder:text-white/30 focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 animate-shake'
                    : 'border-[#C59B27]/40 focus:border-[#DFB847] focus:shadow-glow-gold'
                }`}
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Invalid administrator passkey. Access denied.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Unlock Admin Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
