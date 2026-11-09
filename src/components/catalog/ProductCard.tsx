import React, { useState } from 'react';
import { Star, Eye, Plus, Check, Sun, Droplets, PawPrint, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../store/useStore';
import { useGSAPCardTilt } from '../../hooks/useGSAPCardTilt';
import { getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);
  const addToCart = useStore((state) => state.addToCart);
  const setQuickViewProduct = useStore((state) => state.setQuickViewProduct);

  const displayImage = getOptimizedCloudinaryUrl(product.image, { width: 600 });

  const { elementRef, glowRef } = useGSAPCardTilt<HTMLDivElement>({
    maxTilt: 10,
    perspective: 1000,
    scale: 1.02,
    glow: true
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div
      ref={elementRef}
      onClick={() => setQuickViewProduct(product)}
      className="relative group rounded-3xl p-4 glass-card-light cursor-pointer overflow-hidden transition-all duration-300 flex flex-col justify-between"
    >
      {/* Dynamic Cursor Light Reflection Glow (Warm Metallic Gold) */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px opacity-0 w-48 h-48 rounded-full blur-2xl z-0"
        style={{
          background: 'radial-gradient(circle, rgba(197, 155, 39, 0.35) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10">
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EDE8DC] mb-4">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {product.stockCount === 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0A1C13] text-[#DFB847] border border-[#C59B27]/50 shadow-sm flex items-center gap-1">
                Sold Out
              </span>
            ) : product.featured ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C59B27] text-[#0F2E1E] shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Featured
              </span>
            ) : null}
            {product.petFriendly && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0A1C13]/90 text-[#F8F6F0] border border-[#C59B27]/40 backdrop-blur-md flex items-center gap-1">
                <PawPrint className="w-2.5 h-2.5 text-[#C59B27]" /> Pet-Safe
              </span>
            )}
          </div>

          {/* Quick Inspect Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-[#0F2E1E] hover:text-[#C59B27] border border-[#C59B27]/30 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md hover:scale-110 shadow-md"
            title="Quick Inspect"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Category Tag Pill */}
          <div className="absolute bottom-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider bg-[#0A1C13]/90 text-[#F8F6F0] border border-[#C59B27]/40 backdrop-blur-md">
              {product.categoryName.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Botanical Title & Scientific Name */}
        <div className="space-y-1 mb-2">
          <h3 className="font-serif text-lg font-bold text-[#0F2E1E] group-hover:text-[#C59B27] transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.scientificName && (
            <p className="text-xs text-[#4B6E4A] italic font-serif line-clamp-1 font-medium">
              {product.scientificName}
            </p>
          )}
        </div>


        {/* Light & Care Micro-Specs */}
        <div className="flex items-center gap-2 mb-4 text-[11px] text-[#0F2E1E]">
          {product.light && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8F6F0] border border-[#C59B27]/30">
              <Sun className="w-3 h-3 text-[#C59B27]" />
              <span className="font-medium">{product.light}</span>
            </div>
          )}
          {product.maintenance && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8F6F0] border border-[#C59B27]/30">
              <Droplets className="w-3 h-3 text-[#4B6E4A]" />
              <span className="font-medium">{product.maintenance} Care</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Price & Add To Cart Button */}
      <div className="relative z-10 pt-3 border-t border-[#C59B27]/25 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#4B6E4A] block font-bold">
            Specimen Price
          </span>
          <span className="text-xl font-bold font-mono text-[#0F2E1E]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {product.stockCount === 0 ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/15550192834?text=${encodeURIComponent(`Hello EdenLeaf, I would like to inquire about restock for ${product.name}!`)}`, '_blank');
            }}
            className="px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider bg-[#0A1C13] text-[#DFB847] border border-[#C59B27]/40 hover:bg-[#1A4D34] transition-all"
            title="Inquire restock availability on WhatsApp"
          >
            Inquire Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-sm ${
              isAdded
                ? 'bg-[#0F2E1E] text-white scale-105'
                : 'bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
