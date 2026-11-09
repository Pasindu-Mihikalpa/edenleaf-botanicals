import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

export const CartDrawer: React.FC = () => {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const setIsCartOpen = useStore((state) => state.setIsCartOpen);
  const cart = useStore((state) => state.cart);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const getCartTotal = useStore((state) => state.getCartTotal);
  const setIsOrderModalOpen = useStore((state) => state.setIsOrderModalOpen);

  if (!isCartOpen) return null;

  const subtotal = getCartTotal();
  const delivery = subtotal >= 100 || subtotal === 0 ? 0 : 12.00;
  const total = subtotal + delivery;

  const handleProceedToDispatch = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A1C13]/98 border-l border-[#C59B27]/30 backdrop-blur-2xl p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 text-[#F8F6F0]">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1A4D34]/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#05130D] border border-[#C59B27]/40 flex items-center justify-center text-[#C59B27]">
                  <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold text-white">Your Selection</h2>
                  <span className="text-[11px] font-mono text-[#C59B27] font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} Items Selected
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="mt-6 space-y-4 max-h-[58vh] overflow-y-auto pr-1">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-[#05130D] mx-auto flex items-center justify-center text-[#C59B27]">
                    <ShoppingBag className="w-6 h-6 opacity-50" />
                  </div>
                  <p className="font-serif text-base text-white">Your cart is currently empty</p>
                  <p className="text-xs text-emerald-300/60 max-w-xs mx-auto">
                    Explore our living 46-cultivar showcase or try the Plant Matchmaker.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 rounded-2xl bg-[#05130D]/80 border border-[#C59B27]/25 flex items-center gap-3.5 group"
                  >
                    <img
                      src={getOptimizedCloudinaryUrl(item.product.image, { width: 140, height: 140 })}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#0F2E1E]"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-[#C59B27] font-mono font-bold">
                        ${item.product.price.toFixed(2)} each
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-2 bg-[#0A1C13] px-2 py-0.5 rounded-lg border border-[#C59B27]/30">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-emerald-300 hover:text-white p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-emerald-300 hover:text-white p-0.5"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-xs font-mono font-bold text-white">
                          = ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer & Order Trigger */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-[#1A4D34]/50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-emerald-200/80">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-200/80">
                  <span>Courier Delivery:</span>
                  <span className="font-mono font-semibold">
                    {delivery === 0 ? <span className="text-[#DFB847] font-bold">FREE (Over $100)</span> : `$${delivery.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-[#1A4D34]/50">
                  <span>Total Estimated:</span>
                  <span className="font-mono text-xl text-[#DFB847]">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToDispatch}
                className="w-full py-4 rounded-2xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-gold transition-all hover:scale-[1.02]"
              >
                <span>Proceed to Order Dispatch</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full py-1 text-center text-[11px] text-emerald-400/60 hover:text-rose-400 transition-colors"
              >
                Clear Entire Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
