import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';

interface Product {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  thumbnail: string;
  configJson: string;
  isFeatured: boolean;
  createdAt: string;
}

const CATEGORIES = ['Wedding', 'Festival', 'Birthday', 'Anniversary', 'Religious', 'Corporate', 'Baby Shower', 'Other'];

export default function AdminProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Wedding');
  const [formPrice, setFormPrice] = useState('13');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getProducts({ search: search || undefined, category: categoryFilter || undefined, page })
      .then((res) => {
        setProducts(res.products);
        setTotalPages(res.pagination?.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, categoryFilter, page]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Wedding');
    setFormPrice('13');
    setFormThumbnail('');
    setFormFeatured(false);
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormDescription(product.description || '');
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormThumbnail(product.thumbnail);
    setFormFeatured(product.isFeatured);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formTitle || !formCategory || !formPrice || !formThumbnail) {
      alert('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          title: formTitle,
          description: formDescription || null,
          category: formCategory,
          price: parseFloat(formPrice),
          thumbnail: formThumbnail,
          isFeatured: formFeatured,
        });
      } else {
        await createProduct({
          title: formTitle,
          description: formDescription || undefined,
          category: formCategory,
          price: parseFloat(formPrice),
          thumbnail: formThumbnail,
          isFeatured: formFeatured,
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { isFeatured: !product.isFeatured });
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p));
    } catch {
      alert('Failed to update.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="glass-panel p-6 rounded-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-200 pb-4 mb-5">
          <h2 className="text-lg font-display text-luxury-accent font-semibold">Product Catalog</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-3 py-1.5 focus:outline-none focus:border-luxury-gold w-44" />
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="bg-luxury-dark border border-gold-300 text-xs text-luxury-accent rounded px-2 py-1.5 focus:outline-none focus:border-luxury-gold">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={openAddModal}
              className="px-4 py-1.5 bg-luxury-gold text-luxury-accent text-xs font-bold rounded cursor-pointer hover:bg-luxury-gold/90 transition-colors">
              + Add Product
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-square bg-gray-100/50 rounded-lg animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🛍️</p>
            <p className="text-sm">No products found</p>
            <button onClick={openAddModal} className="mt-3 text-luxury-gold text-xs underline cursor-pointer">Add your first product</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-gold-200/50 rounded-lg overflow-hidden hover:border-luxury-gold transition-colors group">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-luxury-dark">
                  {p.thumbnail ? (
                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">🎨</div>
                  )}
                  {p.isFeatured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-luxury-gold text-luxury-accent text-[9px] font-bold rounded uppercase">Featured</span>
                  )}
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button onClick={() => openEditModal(p)}
                      className="px-3 py-1.5 bg-white text-luxury-accent text-[10px] font-bold rounded cursor-pointer">Edit</button>
                    <button onClick={() => handleDelete(p.id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-bold rounded cursor-pointer">Delete</button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <h3 className="text-xs font-semibold text-luxury-accent truncate">{p.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-gold-50 border border-gold-200 px-1.5 py-0.5 rounded text-luxury-gold">{p.category}</span>
                    <span className="text-xs font-bold text-luxury-gold">₹{p.price}/pc</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button onClick={() => toggleFeatured(p)}
                      className={`text-[9px] px-2 py-0.5 rounded border cursor-pointer ${p.isFeatured ? 'bg-luxury-gold/10 border-luxury-gold text-luxury-gold' : 'border-gray-300 text-gray-500'}`}>
                      {p.isFeatured ? '⭐ Featured' : '☆ Feature'}
                    </button>
                    <button onClick={() => openEditModal(p)}
                      className="text-[9px] text-luxury-gold cursor-pointer hover:underline">Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer">← Prev</button>
            <span className="px-3 py-1 text-[10px] text-gray-500">Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-[10px] border border-gold-300 rounded text-luxury-gold disabled:opacity-30 cursor-pointer">Next →</button>
          </div>
        )}
      </div>

      {/* ═══ Add/Edit Modal ═══ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-luxury-dark border border-gold-200 rounded-xl max-w-lg w-full p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-gold-gradient">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-luxury-accent text-lg cursor-pointer">✕</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">Title *</label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Royal Peacock Green"
                  className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">Description</label>
                <textarea rows={3} value={formDescription} onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Product description..."
                  className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Category *</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500">Price (₹) *</label>
                  <input type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">Thumbnail URL *</label>
                <input type="text" value={formThumbnail} onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://... or /design-1.jpeg"
                  className="w-full bg-luxury-dark border border-gold-300 p-2.5 text-xs text-luxury-accent focus:outline-none focus:border-luxury-gold rounded" />
                {formThumbnail && (
                  <div className="w-20 h-20 rounded mt-2 overflow-hidden border border-gold-200">
                    <img src={formThumbnail} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 accent-luxury-gold cursor-pointer" />
                <span className="text-xs text-luxury-accent">Mark as Featured</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 text-xs border border-gold-300 text-gray-500 rounded cursor-pointer hover:text-luxury-accent transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 px-4 py-2.5 bg-luxury-gold text-luxury-accent text-xs font-bold rounded cursor-pointer disabled:opacity-50">
                {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
