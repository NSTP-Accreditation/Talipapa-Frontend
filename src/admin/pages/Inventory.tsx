import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Plus, Edit, Trash2, AlertTriangle, Box, Search, X, TrendingUp, TrendingDown, Tag } from 'lucide-react';
import { useLoadingState } from '@/hooks/useLoadingState';
import { InventoryPageSkeleton } from '@/components/LoadingSkeletons';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useState, useEffect, useRef } from 'react';

interface Item {
  id: string;
  name: string;
  image?: string;
  category?: string;
}

const Inventory: React.FC = () => {
  const { isLoading } = useLoadingState(1000);

  const [products, setProducts] = useState<Item[]>([
    { id: '680212ebec8f3c32f1aeff0f', name: 'Eco Rug', image: 'https://images.unsplash.com/photo-1567016432779-2e1b4b4b0a4b?auto=format&fit=crop&w=800&q=60', category: 'Home Goods' },
    { id: '6802139aec8f3c32f1aeff1e', name: 'Eco Bag', image: 'https://images.unsplash.com/photo-1520975922242-8f8b0d7f3f6f?auto=format&fit=crop&w=800&q=60', category: 'Accessories' },
    { id: '68021467ec8f3c32f1aeff24', name: 'Liquid Fertilizer', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60', category: 'Garden' },
  ]);

  const [materials, setMaterials] = useState<Item[]>([
    { id: '6803639330d494ae93ac5e3f', name: 'PET bottles', image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?auto=format&fit=crop&w=800&q=60', category: 'Plastic' },
    { id: '680363d830d494ae93ac5e45', name: 'Soft and hard plastics', image: 'https://images.unsplash.com/photo-1581578017426-6d4d7b2b8c9b?auto=format&fit=crop&w=800&q=60', category: 'Plastic' },
  ]);

  const [search, setSearch] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSubcategory, setFormSubcategory] = useState('');

  useEffect(() => {
    if (!showAddProduct && !showAddMaterial) {
      setFormName('');
      setFormImage('');
      setFormCategory('');
    }
  }, [showAddProduct, showAddMaterial]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name.toLowerCase().includes(q) || p.id.includes(q));
  }, [products, search]);

  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return materials;
    return materials.filter(m => m.name.toLowerCase().includes(q) || m.id.includes(q));
  }, [materials, search]);

  if (isLoading) return <InventoryPageSkeleton />;

  function addItem(type: 'product' | 'material') {
    if (!formName.trim()) return alert('Please enter a name');
    if (!formCategory.trim()) return alert('Please select a category');
    if (!formSubcategory.trim()) return alert('Please select a subcategory');
    const newItem: Item = { 
      id: Date.now().toString(16), 
      name: formName.trim(), 
      image: formImage || '', 
      category: `${formCategory.trim()} / ${formSubcategory.trim()}` 
    };
    if (type === 'product') setProducts(prev => [newItem, ...prev]);
    else setMaterials(prev => [newItem, ...prev]);
    setShowAddProduct(false);
    setShowAddMaterial(false);
  }

  const AddModal: React.FC<{ open: boolean; onClose: () => void; type: 'product' | 'material' }> = ({ open, onClose, type }) => {
    const nameRef = useRef<HTMLInputElement | null>(null);
    const fileUrlRef = useRef<string | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (!open) return;
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => nameRef.current?.focus(), 0);

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      window.addEventListener('keydown', onKey);
      return () => {
        window.removeEventListener('keydown', onKey);
        previouslyFocused.current?.focus();
        if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
        fileUrlRef.current = null;
      };
    }, [open, onClose]);

    if (!open) return null;

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current);
      const url = URL.createObjectURL(file);
      fileUrlRef.current = url;
      setFormImage(url);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" onClick={onClose} />
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
          className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full mx-4 z-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-600 to-emerald-600" />
          
          <div className="px-8 pt-8 pb-6 border-b border-green-100 bg-gradient-to-br from-green-600 via-green-700 to-emerald-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg ring-1 ring-white/30">
                  {type === 'product' ? <Package className="w-7 h-7 text-white" /> : <Box className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h3 id="add-modal-title" className="text-2xl font-bold text-white tracking-tight">
                    Add New {type === 'product' ? 'Product' : 'Material'}
                  </h3>
                  <p className="text-sm text-green-50/90 mt-1.5">Fill in the details below to create a new entry</p>
                </div>
              </div>
              <button aria-label="Close" onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/20 p-3 rounded-2xl transition-all duration-200 hover:rotate-90">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    {type === 'product' ? 'Product' : 'Material'} Name <span className="text-red-500 text-base">*</span>
                  </label>
                  <Input 
                    ref={nameRef as any} 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)} 
                    placeholder={`e.g., ${type === 'product' ? 'Eco-Friendly Water Bottle' : 'Recycled Aluminum'}`}
                    className="border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl h-12 text-base transition-all duration-200 group-hover:border-gray-300"
                  />
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    Category <span className="text-red-500 text-base">*</span>
                  </label>
                  <div className="flex flex-col gap-3">
                    <select
                      value={formCategory}
                      onChange={e => {
                        setFormCategory(e.target.value);
                        // Reset subcategory when category changes
                        setFormSubcategory('');
                      }}
                      className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl h-12 text-base transition-all duration-200 group-hover:border-gray-300 px-4 bg-white"
                    >
                      <option value="">Select category</option>
                      {type === 'product' ? (
                        <>
                          <option value="Agricultural">Agricultural</option>
                          <option value="Non Agricultural">Non Agricultural</option>
                        </>
                      ) : (
                        <>
                          <option value="Plastic">Plastic</option>
                          <option value="Metal">Metal</option>
                          <option value="Paper">Paper</option>
                          <option value="Organic">Organic</option>
                        </>
                      )}
                    </select>

                    <select
                      value={formSubcategory}
                      onChange={e => setFormSubcategory(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl h-12 text-base transition-all duration-200 group-hover:border-gray-300 px-4 bg-white"
                    >
                      <option value="">Select subcategory</option>
                      {/* Subcategory options depend on selected category */}
                      {/* Product categories */}
                      {type === 'product' && formCategory === 'Agricultural' && (
                        <>
                          <option value="Crops">Crops</option>
                          <option value="Fertilizers">Fertilizers</option>
                          <option value="Seeds">Seeds</option>
                          <option value="Livestock">Livestock</option>
                        </>
                      )}

                      {type === 'product' && formCategory === 'Non Agricultural' && (
                        <>
                          <option value="Household">Household</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Clothing">Clothing</option>
                          <option value="Construction">Construction</option>
                        </>
                      )}

                      {/* Material categories */}
                      {type === 'material' && formCategory === 'Plastic' && (
                        <>
                          <option value="PET">PET</option>
                          <option value="HDPE">HDPE</option>
                          <option value="Mixed">Mixed</option>
                        </>
                      )}

                      {type === 'material' && formCategory === 'Metal' && (
                        <>
                          <option value="Aluminum">Aluminum</option>
                          <option value="Steel">Steel</option>
                          <option value="Copper">Copper</option>
                        </>
                      )}

                      {type === 'material' && formCategory === 'Paper' && (
                        <>
                          <option value="Cardboard">Cardboard</option>
                          <option value="Newspaper">Newspaper</option>
                          <option value="MixedPaper">Mixed Paper</option>
                        </>
                      )}

                      {type === 'material' && formCategory === 'Organic' && (
                        <>
                          <option value="Garden Soil">Garden Soil</option>
                          <option value="Coco Fiber">Coco Fiber</option>
                          <option value="Liquid Conditioner">Liquid Conditioner</option>
                          <option value="Vermi Soil">Vermi Soil</option>
                          <option value="Coco Peat">Coco Peat</option>
                          <option value="Shredded Leaves">Shredded Leaves</option>
                        </>
                      )}
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Choose a category and a matching subcategory for better organization</p>
                </div>

                <div className="group">
                  <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                    Upload Image (Optional)
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={onFileChange} 
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-green-50 file:to-emerald-50 file:text-green-700 hover:file:from-green-100 hover:file:to-emerald-100 file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 group-hover:border-green-400 rounded-xl focus:outline-none focus:border-green-500 transition-all duration-200 bg-gray-50/50"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2.5 ml-1 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Supported: JPG, PNG, WEBP, GIF • Max size: 5MB
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="group h-full">
                  <label className="text-sm font-bold text-gray-700 mb-2.5 block flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Image Preview
                  </label>
                  <div className="relative w-full h-[calc(100%-2rem)] min-h-[300px] rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
                    {formImage ? (
                      <>
                        <ImageWithFallback 
                          src={formImage} 
                          alt={formName || 'preview'} 
                          className="w-full h-full object-contain rounded-xl" 
                        />
                        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Ready
                        </div>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 font-semibold mb-1">No image yet</p>
                        <p className="text-xs text-gray-400">Upload a file to see preview</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200 rounded-b-3xl flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
              <span className="text-red-500 text-sm">*</span> Required fields
            </p>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border-2 border-gray-300 hover:bg-white hover:border-gray-400 font-bold text-gray-700 transition-all duration-200 shadow-sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => addItem(type)} 
                className="px-7 py-2.5 bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-700 hover:via-green-800 hover:to-emerald-800 text-white rounded-xl shadow-xl shadow-green-600/40 font-bold transition-all duration-200 hover:shadow-2xl hover:shadow-green-600/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add {type === 'product' ? 'Product' : 'Material'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-2xl shadow-lg shadow-green-500/20 ring-1 ring-green-200/50">
              <Package className="w-8 h-8 text-green-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage products and materials for trading operations</p>
            </div>
          </div>
        </div>
  <div className="relative group ml-6 flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          <Input 
            placeholder="Search inventory..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="pl-12 pr-4 py-3 w-full max-w-[80rem] border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-base bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-7 w-7 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{products.length}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                  <Box className="h-7 w-7 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Materials</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{materials.length}</p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="h-7 w-7 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Low Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">5</p>
                </div>
              </div>
              <TrendingDown className="w-5 h-5 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-600" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 group-hover:scale-110 transition-transform duration-300">
                  <Box className="h-7 w-7 text-red-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Out of Stock</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                </div>
              </div>
              <AlertTriangle className="w-5 h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
              Products
            </h2>
            <p className="text-sm text-gray-500 mt-1 ml-4">Showing {filteredProducts.length} of {products.length} products</p>
          </div>
          <Button 
            onClick={() => setShowAddProduct(true)} 
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white inline-flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5"/> Add Product
          </Button>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No products found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredProducts.map((p, idx) => (
                  <div key={p.id} className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-white">
                          <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-200">{p.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{p.id}</div>
                          {p.category && (
                            <div className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {p.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg">1 Point</div>
                      <Button variant="outline" className="px-4 py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200">
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="destructive" className="px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
              Materials
            </h2>
            <p className="text-sm text-gray-500 mt-1 ml-4">Showing {filteredMaterials.length} of {materials.length} materials</p>
          </div>
          <Button 
            onClick={() => setShowAddMaterial(true)} 
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white inline-flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5"/> Add Material
          </Button>
        </div>

        <Card className="border-none shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Box className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No materials found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                filteredMaterials.map((m, idx) => (
                  <div key={m.id} className="flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-white">
                          <ImageWithFallback src={m.image} alt={m.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors duration-200">{m.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">{m.id}</div>
                          {m.category && (
                          <div className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {m.category}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg">1 Unit</div>
                      <Button variant="outline" className="px-4 py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200">
                        <Edit className="w-4 h-4"/>
                      </Button>
                      <Button variant="destructive" className="px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                        <Trash2 className="w-4 h-4"/>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AddModal open={showAddProduct} onClose={() => setShowAddProduct(false)} type="product" />
      <AddModal open={showAddMaterial} onClose={() => setShowAddMaterial(false)} type="material" />
    </div>
  );
};

export default Inventory;