import React, { useState } from 'react';
import { X, Star, Sun, Droplets, Check, Plus, Minus, MessageSquare, ShoppingBag, PawPrint } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

export const QuickViewModal: React.FC = () => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = useStore((state) => state.quickViewProduct);
  const setQuickViewProduct = useStore((state) => state.setQuickViewProduct);
  const addToCart = useStore((state) => state.addToCart);
  const dispatchPhone = useStore((state) => state.dispatchPhone);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleDirectWhatsApp = () => {
    const rawPhone = dispatchPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `🌿 *DIRECT SPECIMEN INQUIRY - EDENLEAF* 🌿%0A%0A` +
      `Hello EdenLeaf! I would like to inquire about ordering:%0A` +
      `• *${product.name}* (${product.categoryName})%0A` +
      `• Quantity: ${quantity}%0A` +
      `• Unit Price: $${product.price.toFixed(2)}%0A` +
      `• Total: $${(product.price * quantity).toFixed(2)}%0A%0A` +
      `Please let me know availability and delivery options!`
    );
    window.open(`https://wa.me/${rawPhone || '15550192834'}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
      />

      {/* Modal Container in Obsidian Evergreen (#0A1C13) */}
      <div className="relative w-full max-w-4xl bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl overflow-hidden shadow-2xl z-10 animate-in zoom-in-95 duration-300 text-[#F8F6F0]">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#05130D]/90 text-emerald-300 hover:text-white border border-[#C59B27]/40 hover:bg-[#1A4D34] transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Specimen View */}
          <div className="relative h-72 md:h-full min-h-[350px] bg-[#05130D] overflow-hidden">
            <img
              src={getOptimizedCloudinaryUrl(product.image, { width: 900 })}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C13] via-transparent to-black/20" />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-[#05130D]/90 text-[#DFB847] border border-[#C59B27]/40 backdrop-blur-md">
                {product.categoryName}
              </span>
              {product.petFriendly && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F2E1E]/90 text-white border border-[#C59B27]/40 backdrop-blur-md flex items-center gap-1.5">
                  <PawPrint className="w-3.5 h-3.5 text-[#C59B27]" /> Certified Pet-Safe
                </span>
              )}
            </div>

            {product.dimensions && (
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#05130D]/90 border border-[#C59B27]/30 backdrop-blur-md text-xs text-emerald-200 font-mono">
                Physical Spec: {product.dimensions}
              </div>
            )}
          </div>

          {/* Right Column: Specimen Details & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1">
                  {product.name}
                </h2>
                {product.scientificName && (
                  <p className="text-sm text-[#DFB847] italic font-serif font-semibold">
                    {product.scientificName}
                  </p>
                )}
              </div>

              {/* Price & Rating */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1A4D34]/50">
                <span className="font-mono text-3xl font-bold text-[#DFB847]">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1 text-xs text-emerald-300">
                  <div className="flex text-[#C59B27]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`}
                      />
                    ))}
                  </div>
                  <span className="font-bold ml-1">{product.rating}</span>
                  <span className="text-emerald-400/80">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-emerald-100/80 leading-relaxed font-light">
                {product.description}
              </p>

              {/* Care Spec Badges */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {product.light && (
                  <div className="p-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 flex items-center gap-2.5">
                    <Sun className="w-4 h-4 text-[#C59B27]" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">Lighting</span>
                      <span className="text-xs font-semibold text-white">{product.light}</span>
                    </div>
                  </div>
                )}

                {product.maintenance && (
                  <div className="p-2.5 rounded-xl bg-[#05130D] border border-[#C59B27]/30 flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#4B6E4A]" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">Care Level</span>
                      <span className="text-xs font-semibold text-white">{product.maintenance}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botanical Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#05130D] text-[#DFB847] border border-[#C59B27]/25"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions: Quantity Selector & Dual Triggers */}
            <div className="space-y-4 pt-4 border-t border-[#1A4D34]/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">Order Quantity:</span>
                <div className="flex items-center gap-3 bg-[#05130D] px-3 py-1.5 rounded-xl border border-[#C59B27]/30">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 text-emerald-300 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono font-bold text-sm w-6 text-center text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-emerald-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                    isAdded
                      ? 'bg-[#0F2E1E] text-white'
                      : 'bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Selection
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart (${(product.price * quantity).toFixed(2)})
                    </>
                  )}
                </button>

                <button
                  onClick={handleDirectWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-[#0A1C13] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageSquare className="w-4 h-4 fill-current" /> Direct WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
