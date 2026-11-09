import React, { useState } from 'react';
import { X, Mail, MessageSquare, CheckCircle, Sparkles, MapPin, User, Phone, FileText, Settings, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../store/useStore';

export const OrderDispatchModal: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [orderSent, setOrderSent] = useState<string | null>(null);

  const isOrderModalOpen = useStore((state) => state.isOrderModalOpen);
  const setIsOrderModalOpen = useStore((state) => state.setIsOrderModalOpen);
  const cart = useStore((state) => state.cart);
  const clearCart = useStore((state) => state.clearCart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const addOrder = useStore((state) => state.addOrder);

  const customerInfo = useStore((state) => state.customerInfo);
  const setCustomerInfo = useStore((state) => state.setCustomerInfo);

  const dispatchPhone = useStore((state) => state.dispatchPhone);
  const setDispatchPhone = useStore((state) => state.setDispatchPhone);
  const dispatchEmail = useStore((state) => state.dispatchEmail);
  const setDispatchEmail = useStore((state) => state.setDispatchEmail);

  if (!isOrderModalOpen) return null;

  const subtotal = getCartTotal();
  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 12.00;
  const grandTotal = subtotal + delivery;

  // Build formatted itemized text payload
  const buildItemizedText = () => {
    let text = `🌿 *NEW BOTANICAL ORDER - EDENLEAF* 🌿\n`;
    text += `*Growing Beauty, Naturally*\n`;
    text += `====================================\n`;
    text += `*CUSTOMER DETAILS:*\n`;
    text += `• Name: ${customerInfo.name || 'Valued Guest'}\n`;
    text += `• Phone: ${customerInfo.phone || 'Not provided'}\n`;
    text += `• Email: ${customerInfo.email || 'Not provided'}\n`;
    text += `• Address: ${customerInfo.address || 'Standard Nursery Pick-up'}\n`;
    if (customerInfo.notes) {
      text += `• Notes: ${customerInfo.notes}\n`;
    }
    text += `------------------------------------\n`;
    text += `*ITEMIZED SPECIMENS & SUPPLIES:*\n`;
    cart.forEach((item, index) => {
      text += `${index + 1}. ${item.quantity}x ${item.product.name} ($${item.product.price.toFixed(2)} ea) = $${(item.product.price * item.quantity).toFixed(2)}\n`;
    });
    text += `------------------------------------\n`;
    text += `• Subtotal: $${subtotal.toFixed(2)}\n`;
    text += `• Courier Delivery: ${delivery === 0 ? 'FREE' : `$${delivery.toFixed(2)}`}\n`;
    text += `*TOTAL ESTIMATED: $${grandTotal.toFixed(2)}*\n`;
    text += `====================================\n`;
    text += `_Dispatched via EdenLeaf Showcase Engine_`;
    return text;
  };

  const fireDelightConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#C59B27', '#DFB847', '#0F2E1E', '#4B6E4A', '#FFFFFF']
    });
  };

  // 1. WhatsApp Action Trigger
  const handleSendWhatsApp = () => {
    const rawPhone = dispatchPhone.replace(/[^0-9]/g, '');
    const message = buildItemizedText();
    const encodedUri = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;

    // Auto-record to Admin Order Center
    addOrder({
      customerName: customerInfo.name || 'Valued Guest',
      phone: customerInfo.phone || 'Not provided',
      email: customerInfo.email || 'Not provided',
      address: customerInfo.address || 'Standard Nursery Pick-up',
      notes: customerInfo.notes,
      items: cart.map((c) => ({ product: c.product, quantity: c.quantity })),
      subtotal,
      delivery,
      total: grandTotal,
      dispatchMethod: 'WhatsApp'
    });

    fireDelightConfetti();
    setOrderSent('WhatsApp');
    window.open(encodedUri, '_blank');

    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  // 2. Email Action Trigger
  const handleSendEmail = () => {
    const subject = encodeURIComponent(`EdenLeaf Botanicals Order - ${customerInfo.name || 'Customer'}`);
    const body = encodeURIComponent(buildItemizedText());
    const mailtoUri = `mailto:${dispatchEmail}?subject=${subject}&body=${body}`;

    // Auto-record to Admin Order Center
    addOrder({
      customerName: customerInfo.name || 'Valued Guest',
      phone: customerInfo.phone || 'Not provided',
      email: customerInfo.email || 'Not provided',
      address: customerInfo.address || 'Standard Nursery Pick-up',
      notes: customerInfo.notes,
      items: cart.map((c) => ({ product: c.product, quantity: c.quantity })),
      subtotal,
      delivery,
      total: grandTotal,
      dispatchMethod: 'Email'
    });

    fireDelightConfetti();
    setOrderSent('Email');
    window.location.href = mailtoUri;

    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsOrderModalOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl transition-opacity animate-in fade-in"
      />

      {/* Modal Container in Obsidian Evergreen (#0A1C13) */}
      <div className="relative w-full max-w-4xl bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-8 animate-in zoom-in-95 duration-300 max-h-[92vh] overflow-y-auto text-[#F8F6F0]">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#1A4D34]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#05130D] border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27] shadow-glow-gold">
              <Sparkles className="w-5 h-5 text-[#C59B27] animate-pulse" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Order Dispatch Terminal</h2>
              <p className="text-xs font-mono text-[#C59B27] font-bold">Direct WhatsApp & Email Routing</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
              title="Configure Dispatch Phone & Email"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Target Settings Drawer */}
        {showSettings && (
          <div className="my-4 p-4 rounded-2xl bg-[#05130D] border border-[#C59B27]/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-mono text-[#DFB847] font-bold">
              <span>Target Nursery Dispatch Endpoints (Live Editable)</span>
              <span className="text-[10px] text-emerald-400">Settings Active</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-emerald-300 block mb-1">WhatsApp Business Phone:</label>
                <input
                  type="text"
                  value={dispatchPhone}
                  onChange={(e) => setDispatchPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs font-mono text-white focus:outline-none focus:border-[#C59B27]"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
              <div>
                <label className="text-[11px] text-emerald-300 block mb-1">Orders Destination Email:</label>
                <input
                  type="email"
                  value={dispatchEmail}
                  onChange={(e) => setDispatchEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs font-mono text-white focus:outline-none focus:border-[#C59B27]"
                  placeholder="orders@edenleaf.com"
                />
              </div>
            </div>
          </div>
        )}

        {/* Success Confirmation State */}
        {orderSent && (
          <div className="my-6 p-6 rounded-2xl bg-[#05130D] border border-[#C59B27]/50 text-center space-y-3 animate-in zoom-in-95">
            <CheckCircle className="w-12 h-12 text-[#DFB847] mx-auto animate-bounce" />
            <h3 className="font-serif text-xl font-bold text-white">
              Dispatched via {orderSent}!
            </h3>
            <p className="text-sm text-emerald-100/80 max-w-md mx-auto">
              Your itemized nursery manifest has been structured and sent. Our greenhouse specialist will confirm delivery coordinates shortly.
            </p>
            <button
              onClick={() => {
                setOrderSent(null);
                setIsOrderModalOpen(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-wider transition-all"
            >
              Back to Catalog
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Customer Details Form */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#C59B27] font-bold flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Customer & Delivery Details
            </h3>

            <div>
              <label className="text-xs text-emerald-100/90 block mb-1 font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-emerald-100/90 block mb-1 font-semibold">WhatsApp / Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-emerald-100/90 block mb-1 font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ email: e.target.value })}
                    placeholder="eleanor@botanica.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-emerald-100/90 block mb-1 font-semibold">Delivery Address / Nursery Pick-up</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C59B27]" />
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ address: e.target.value })}
                  placeholder="124 Conservatory Way, Suite 4B, Greenhouse Gate"
                  rows={2}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27] resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-emerald-100/90 block mb-1 font-semibold">Care or Delivery Instructions (Optional)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-[#C59B27]" />
                <textarea
                  value={customerInfo.notes}
                  onChange={(e) => setCustomerInfo({ notes: e.target.value })}
                  placeholder="e.g. Leave in shaded porch; include repotting instructions."
                  rows={2}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#05130D]/70 border border-[#C59B27]/25 text-xs text-emerald-200">
              <ShieldCheck className="w-4 h-4 text-[#DFB847] shrink-0" />
              <span>Zero upfront payment required. Our nursery confirms live plant health prior to courier departure.</span>
            </div>
          </div>

          {/* Right Column: Live Manifest Preview & Dual Action Triggers */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#DFB847] font-bold mb-3 flex items-center justify-between">
                <span>Structured Manifest Preview</span>
                <span className="text-[10px] text-emerald-300 font-normal">Real-Time Payload</span>
              </h3>

              {/* Formatted Text Box */}
              <div className="p-4 rounded-2xl bg-[#05130D] border border-[#C59B27]/40 font-mono text-[11px] text-emerald-100 whitespace-pre-wrap max-h-56 overflow-y-auto scrollbar-thin">
                {buildItemizedText()}
              </div>
            </div>

            {/* Action Triggers */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono px-1">
                <span className="text-emerald-200">Total Payable upon Dispatch:</span>
                <span className="text-2xl font-bold text-[#DFB847]">${grandTotal.toFixed(2)}</span>
              </div>

              {/* Trigger 1: WhatsApp */}
              <button
                onClick={handleSendWhatsApp}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-[#0A1C13] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Send via WhatsApp ({dispatchPhone})</span>
              </button>

              {/* Trigger 2: Email */}
              <button
                onClick={handleSendEmail}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-[1.01]"
              >
                <Mail className="w-4 h-4" />
                <span>Send via Email ({dispatchEmail})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
