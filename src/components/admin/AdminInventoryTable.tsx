import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Edit3, Image, AlertCircle, Check, RotateCcw, X, Sparkles, Cloud, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { TAXONOMY_CATEGORIES } from '../../data/categories';
import { Product, TaxonomyId } from '../../types';
import { CloudinaryUploader } from './CloudinaryUploader';
import { CloudinaryConfigModal } from './CloudinaryConfigModal';
import { isCloudinaryConfigured, getOptimizedCloudinaryUrl } from '../../utils/cloudinary';

export const AdminInventoryTable: React.FC = () => {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const updateProductStockPrice = useStore((state) => state.updateProductStockPrice);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const resetCatalog = useStore((state) => state.resetCatalog);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCloudinaryModalOpen, setIsCloudinaryModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newScientific, setNewScientific] = useState('');
  const [newCategory, setNewCategory] = useState<TaxonomyId>('flowers');
  const [newPrice, setNewPrice] = useState('35.00');
  const [newStock, setNewStock] = useState('15');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('Collector, Rare, Indoor');

  // Edit Existing Product Form State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editScientific, setEditScientific] = useState('');
  const [editCategory, setEditCategory] = useState<TaxonomyId>('flowers');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCat === 'all' || p.category === selectedCat;
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.scientificName?.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, search, selectedCat]);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const catObj = TAXONOMY_CATEGORIES.find((c) => c.id === newCategory);

    addProduct({
      name: newTitle.trim(),
      scientificName: newScientific.trim() || undefined,
      category: newCategory,
      categoryName: catObj ? catObj.name : 'Flowers',
      price: parseFloat(newPrice) || 25,
      stockCount: parseInt(newStock, 10) || 10,
      inStock: (parseInt(newStock, 10) || 10) > 0,
      rating: 5.0,
      reviewsCount: 1,
      image: newImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80',
      description: newDescription || 'Premium greenhouse specimen nurtured in organic substrates.',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      featured: true,
      light: 'Bright Indirect',
      maintenance: 'Moderate',
      environment: 'Indoor',
      petFriendly: true,
      purpose: 'Lush Foliage'
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewScientific('');
    setNewDescription('');
    setSaveSuccess('Cultivar added successfully with Cloudinary media!');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.name);
    setEditScientific(p.scientificName || '');
    setEditCategory(p.category as TaxonomyId);
    setEditPrice(p.price.toString());
    setEditStock((p.stockCount !== undefined ? p.stockCount : 24).toString());
    setEditImage(p.image);
    setEditDescription(p.description || '');
    setEditTags((p.tags || []).join(', '));
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editTitle.trim()) return;

    const catObj = TAXONOMY_CATEGORIES.find((c) => c.id === editCategory);

    updateProduct(editingProduct.id, {
      name: editTitle.trim(),
      scientificName: editScientific.trim() || undefined,
      category: editCategory,
      categoryName: catObj ? catObj.name : editingProduct.categoryName,
      price: parseFloat(editPrice) || editingProduct.price,
      stockCount: parseInt(editStock, 10) || 0,
      image: editImage || editingProduct.image,
      description: editDescription,
      tags: editTags.split(',').map((t) => t.trim()).filter(Boolean)
    });

    setEditingProduct(null);
    setSaveSuccess(`Updated "${editTitle}" successfully!`);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleStockChange = (id: string, currentPrice: number, delta: number, currentStock = 0) => {
    const nextStock = Math.max(0, currentStock + delta);
    updateProductStockPrice(id, currentPrice, nextStock);
  };

  const handlePriceBlur = (id: string, val: string, currentStock = 0) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      updateProductStockPrice(id, parsed, currentStock);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#05130D] p-5 rounded-3xl border border-[#C59B27]/30">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Inventory Master Matrix</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1A4D34] text-[#DFB847] font-mono">
              {products.length} Cultivars Live
            </span>
          </h2>
          <p className="text-xs text-emerald-200/70 font-light mt-0.5">
            Manage inventory and upload high-res cultivar photos via Cloudinary CDN.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cloudinary Config Button */}
          <button
            onClick={() => setIsCloudinaryModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0A1C13] hover:bg-[#1A4D34] text-emerald-200 hover:text-white border border-[#C59B27]/30 text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            title="Configure Cloudinary Media Credentials"
          >
            <Cloud className="w-4 h-4 text-[#DFB847]" />
            <span className="hidden sm:inline">Cloudinary</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isCloudinaryConfigured() ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
              title={isCloudinaryConfigured() ? 'Cloudinary Ready' : 'Configure Cloudinary'}
            />
          </button>

          {/* Add New Cultivar Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Cultivar</span>
          </button>

          {/* Reset Database Button */}
          <button
            onClick={() => {
              if (confirm('Restore initial pristine 46-cultivar Hayleys catalog?')) {
                resetCatalog();
              }
            }}
            className="p-2.5 rounded-2xl bg-[#0A1C13] hover:bg-[#1A4D34] text-emerald-300 hover:text-white border border-[#C59B27]/30 transition-colors"
            title="Reset catalog to initial seed database"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-[#1A4D34] border border-[#C59B27] text-white text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-[#DFB847]" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Filter & Search Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#05130D]/80 p-3.5 rounded-2xl border border-[#C59B27]/25">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C59B27]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, genus, or species..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C59B27]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 text-xs text-emerald-100 cursor-pointer focus:outline-none"
        >
          <option value="all">All Categories ({products.length})</option>
          {TAXONOMY_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Inventory Table Matrix */}
      <div className="bg-[#05130D] border border-[#C59B27]/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs text-emerald-100">
            <thead className="sticky top-0 bg-[#0A1C13] border-b border-[#C59B27]/30 text-[11px] font-mono uppercase tracking-wider text-[#DFB847] z-10">
              <tr>
                <th className="py-3.5 px-4">Cultivar Specimen</th>
                <th className="py-3.5 px-4">Taxonomy</th>
                <th className="py-3.5 px-4 text-center">Unit Price ($)</th>
                <th className="py-3.5 px-4 text-center">Live Stock</th>
                <th className="py-3.5 px-4 text-center">Storefront Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A4D34]/40 font-light">
              {filteredProducts.map((p) => {
                const stock = p.stockCount !== undefined ? p.stockCount : 24;
                const isSoldOut = stock === 0;
                const optimizedThumbnail = getOptimizedCloudinaryUrl(p.image, { width: 100, height: 100 });

                return (
                  <tr key={p.id} className="hover:bg-[#0E2D20]/60 transition-colors">
                    {/* Cultivar Specimen Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={optimizedThumbnail}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 bg-[#0A1C13] border border-[#C59B27]/25"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-serif font-bold text-white block truncate text-sm">
                            {p.name}
                          </span>
                          {p.scientificName && (
                            <span className="text-[11px] text-[#4B6E4A] italic font-serif block truncate font-medium">
                              {p.scientificName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Taxonomy Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold bg-[#0A1C13] text-[#DFB847] border border-[#C59B27]/30">
                        {p.categoryName.split(' ')[0]}
                      </span>
                    </td>

                    {/* Inline Price Editor */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-[#0A1C13] px-2.5 py-1 rounded-xl border border-[#C59B27]/30 font-mono font-bold text-white">
                        <span className="text-[#DFB847]">$</span>
                        <input
                          type="number"
                          step="0.5"
                          defaultValue={p.price.toFixed(2)}
                          onBlur={(e) => handlePriceBlur(p.id, e.target.value, stock)}
                          className="w-16 bg-transparent text-center focus:outline-none focus:text-[#DFB847]"
                        />
                      </div>
                    </td>

                    {/* Inline Stock Counter */}
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2 bg-[#0A1C13] px-2 py-1 rounded-xl border border-[#C59B27]/30 font-mono font-bold">
                        <button
                          onClick={() => handleStockChange(p.id, p.price, -1, stock)}
                          className="text-emerald-400 hover:text-white px-1 font-bold text-sm"
                        >
                          -
                        </button>
                        <span className={`w-8 text-center text-xs ${isSoldOut ? 'text-rose-400 font-black' : 'text-white'}`}>
                          {stock}
                        </span>
                        <button
                          onClick={() => handleStockChange(p.id, p.price, +1, stock)}
                          className="text-emerald-400 hover:text-white px-1 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Storefront Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {isSoldOut ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-700">
                          Sold Out
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1A4D34] text-[#DFB847] border border-[#C59B27]/40">
                          Active ({stock} left)
                        </span>
                      )}
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 text-emerald-300 hover:text-white hover:bg-[#1A4D34] rounded-xl transition-colors"
                          title="Edit cultivar details & Cloudinary photo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Archive and permanently remove ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Delete product from storefront"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Product Modal with Cloudinary Uploader */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-[#F8F6F0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A4D34]">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#DFB847]" />
                <span>Add New Living Cultivar</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Common Plant / Supply Name *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Variegated Monstera Albo"
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Scientific Binomial Name</label>
                  <input
                    type="text"
                    value={newScientific}
                    onChange={(e) => setNewScientific(e.target.value)}
                    placeholder="e.g. Monstera borsigiana albo"
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Taxonomy Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none"
                  >
                    {TAXONOMY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Initial Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Cloudinary Image Uploader Component */}
              <CloudinaryUploader
                value={newImage}
                onChange={setNewImage}
                onOpenSettings={() => setIsCloudinaryModalOpen(true)}
              />

              <div>
                <label className="text-emerald-200 block mb-1 font-semibold">Botanical Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Describe specimen characteristics, fenestration, or soil amendment composition..."
                  className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1 font-semibold">Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="Collector, Rare, Indoor, Pet-Safe"
                  className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1A4D34]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#05130D] hover:bg-[#1A4D34] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold uppercase tracking-wider shadow-md"
                >
                  Publish to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Existing Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setEditingProduct(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto text-[#F8F6F0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1A4D34]">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#DFB847]" />
                <span>Edit Cultivar Specimen</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProduct} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Common Plant / Supply Name *</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none focus:border-[#C59B27]"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Scientific Binomial Name</label>
                  <input
                    type="text"
                    value={editScientific}
                    onChange={(e) => setEditScientific(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Taxonomy Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none"
                  >
                    {TAXONOMY_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Price ($ USD) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-emerald-200 block mb-1 font-semibold">Live Stock Count *</label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Cloudinary Image Uploader for Existing Product */}
              <CloudinaryUploader
                value={editImage}
                onChange={setEditImage}
                onOpenSettings={() => setIsCloudinaryModalOpen(true)}
              />

              <div>
                <label className="text-emerald-200 block mb-1 font-semibold">Botanical Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-emerald-200 block mb-1 font-semibold">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#05130D] border border-[#C59B27]/30 text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#1A4D34]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-[#05130D] hover:bg-[#1A4D34] text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] font-bold uppercase tracking-wider shadow-md"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloudinary Configuration Modal */}
      <CloudinaryConfigModal
        isOpen={isCloudinaryModalOpen}
        onClose={() => setIsCloudinaryModalOpen(false)}
      />
    </div>
  );
};
