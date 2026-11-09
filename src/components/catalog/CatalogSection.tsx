import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, ChevronDown } from 'lucide-react';
import { ALL_PRODUCTS } from '../../data/products';
import { TAXONOMY_CATEGORIES } from '../../data/categories';
import { ProductCard } from './ProductCard';
import { useStore } from '../../store/useStore';

export const CatalogSection: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const products = useStore((state) => state.products);
  const activeCategory = useStore((state) => state.activeCategory);
  const setActiveCategory = useStore((state) => state.setActiveCategory);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const selectedLight = useStore((state) => state.selectedLight);
  const setSelectedLight = useStore((state) => state.setSelectedLight);
  const selectedMaintenance = useStore((state) => state.selectedMaintenance);
  const setSelectedMaintenance = useStore((state) => state.setSelectedMaintenance);
  const petFriendlyOnly = useStore((state) => state.petFriendlyOnly);
  const setPetFriendlyOnly = useStore((state) => state.setPetFriendlyOnly);
  const selectedSort = useStore((state) => state.selectedSort);
  const setSelectedSort = useStore((state) => state.setSelectedSort);
  const resetFilters = useStore((state) => state.resetFilters);

  // Client-side filtering & search algorithm
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (activeCategory !== 'all' && product.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesScientific = product.scientificName?.toLowerCase().includes(query) ?? false;
        const matchesTags = product.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchesDesc = product.description.toLowerCase().includes(query);

        if (!matchesName && !matchesScientific && !matchesTags && !matchesDesc) {
          return false;
        }
      }

      // Light filter
      if (selectedLight !== 'all' && product.light !== selectedLight) {
        return false;
      }

      // Maintenance filter
      if (selectedMaintenance !== 'all' && product.maintenance !== selectedMaintenance) {
        return false;
      }

      // Pet-friendly toggle
      if (petFriendlyOnly && !product.petFriendly) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price-asc') return a.price - b.price;
      if (selectedSort === 'price-desc') return b.price - a.price;
      if (selectedSort === 'rating-desc') return b.rating - a.rating;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [activeCategory, searchQuery, selectedLight, selectedMaintenance, petFriendlyOnly, selectedSort]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  const hasActiveFilters =
    activeCategory !== 'all' ||
    searchQuery !== '' ||
    selectedLight !== 'all' ||
    selectedMaintenance !== 'all' ||
    petFriendlyOnly ||
    selectedSort !== 'featured';

  return (
    <section id="catalog-section" className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-[#F8F6F0]">
      <div id="catalog" className="absolute -top-16 left-0 pointer-events-none" />
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#C59B27]/40 text-[#4B6E4A] text-xs font-mono tracking-widest uppercase font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Complete 4-Tier Living Portfolio</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#0F2E1E] tracking-tight">
          Explore Our <span className="gold-gradient-text">Master Catalog</span>
        </h2>
        <p className="text-sm sm:text-base text-[#0F2E1E]/75 font-light">
          Browse all 46 Hayleys Agriculture plant nursery cultivars, vibrant cut flowers, aromatic herbs, and tropical fruit starters. Filter in real-time with instant client-side dispatch preview.
        </p>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none scroll-smooth">
        <button
          onClick={() => {
            setActiveCategory('all');
            setVisibleCount(12);
          }}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 shadow-sm ${
            activeCategory === 'all'
              ? 'bg-[#C59B27] text-[#0F2E1E] scale-105'
              : 'bg-white/80 hover:bg-white text-[#0F2E1E] border border-[#C59B27]/30'
          }`}
        >
          <span>All Taxonomies</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] ${
            activeCategory === 'all' ? 'bg-[#0F2E1E] text-white' : 'bg-[#F8F6F0] text-[#0F2E1E]'
          }`}>
            {products.length}
          </span>
        </button>

        {TAXONOMY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setVisibleCount(12);
            }}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 shadow-sm ${
              activeCategory === cat.id
                ? 'bg-[#C59B27] text-[#0F2E1E] scale-105'
                : 'bg-white/80 hover:bg-white text-[#0F2E1E] border border-[#C59B27]/30'
            }`}
          >
            <span>{cat.shortName}</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeCategory === cat.id ? 'bg-[#0F2E1E] text-white' : 'bg-[#F8F6F0] text-[#0F2E1E]'
            }`}>
              {products.filter((p) => p.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Dynamic Filter Controls Toolbar */}
      <div className="glass-card-light rounded-3xl p-4 sm:p-6 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              placeholder="Search by name, scientific genus, tags (e.g. Monstera, Roses, Coco Peat, SK5)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl glass-input-light text-sm placeholder:text-[#0F2E1E]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/5 text-[#0F2E1E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters Group */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Light Dropdown */}
            <select
              value={selectedLight}
              onChange={(e) => setSelectedLight(e.target.value)}
              className="px-3.5 py-3 rounded-2xl glass-input-light text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Light Levels</option>
              <option value="Direct Sunlight">Direct Sunlight</option>
              <option value="Bright Indirect">Bright Indirect</option>
              <option value="Medium Light">Medium Light</option>
              <option value="Low Light">Low Light</option>
            </select>

            {/* Maintenance Dropdown */}
            <select
              value={selectedMaintenance}
              onChange={(e) => setSelectedMaintenance(e.target.value)}
              className="px-3.5 py-3 rounded-2xl glass-input-light text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Care Regimens</option>
              <option value="Low">Low Effort</option>
              <option value="Moderate">Moderate Care</option>
              <option value="High">Enthusiast / High</option>
            </select>

            {/* Pet Friendly Toggle */}
            <button
              onClick={() => setPetFriendlyOnly(!petFriendlyOnly)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                petFriendlyOnly
                  ? 'bg-[#0F2E1E] text-white'
                  : 'bg-white text-[#0F2E1E] border border-[#C59B27]/40 hover:bg-[#F8F6F0]'
              }`}
            >
              <span>🐾 Pet-Safe Only</span>
            </button>

            {/* Sort Dropdown */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3.5 py-3 rounded-2xl glass-input-light text-xs font-semibold cursor-pointer"
            >
              <option value="featured">Sort: Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: Highest First</option>
            </select>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-700 hover:bg-rose-100 border border-rose-300 transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Counter Strip */}
        <div className="mt-4 pt-4 border-t border-[#C59B27]/20 flex items-center justify-between text-xs text-[#0F2E1E]/80 font-mono">
          <span>
            Displaying <strong className="text-[#0F2E1E] font-bold">{displayedProducts.length}</strong> of{' '}
            <strong className="text-[#C59B27] font-bold">{filteredProducts.length}</strong> matching specimens
          </span>
          {activeCategory !== 'all' && (
            <span className="hidden sm:inline-block text-[#4B6E4A] font-semibold">
              Taxonomy: {TAXONOMY_CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </span>
          )}
        </div>
      </div>

      {/* Catalog Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center rounded-3xl glass-card-light space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#C59B27]/20 mx-auto flex items-center justify-center text-[#C59B27]">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#0F2E1E]">No botanical specimens matched</h3>
          <p className="text-sm text-[#0F2E1E]/70 max-w-md mx-auto">
            Try adjusting your search criteria, widening the light filter, or toggling off the pet-friendly requirement.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* "Load More" Progressive DOM Optimization Button */}
      {filteredProducts.length > visibleCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3.5 rounded-full bg-[#0F2E1E] hover:bg-[#1A4D34] text-[#F8F6F0] font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105 inline-flex items-center gap-2"
          >
            <span>Load More Cultivars (+12)</span>
            <ChevronDown className="w-4 h-4 text-[#C59B27]" />
          </button>
        </div>
      )}
    </section>
  );
};
