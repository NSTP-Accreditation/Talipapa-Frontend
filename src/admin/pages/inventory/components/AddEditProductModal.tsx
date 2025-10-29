import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { ProductInterface } from '@/types/global.types';
import { Package, PenSquare, Plus, Tag, X } from 'lucide-react';
import { Dispatch, memo, SetStateAction, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type AddEditProductModalType = {
  showProductModal: boolean;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
  mode: string;
  productToEdit: ProductInterface | null;
  refetchProduct: () => Promise<ProductInterface[]>;
};

const AddEditProductModal = memo(
  ({
    showProductModal,
    setShowProductModal,
    mode,
    productToEdit,
    refetchProduct,
  }: AddEditProductModalType) => {
    const { success, error: showError } = useToast();
    const authFetch = useAuthFetch();

    const [productFormData, setProductFormData] = useState({
      _id: '',
      name: '',
      description: '',
      category: '',
      subCategory: '',
      stocks: 0,
      requiredPoints: 0,
      image: null,
      imageFile: null,
    });

    useEffect(() => {
      if (mode === 'Edit' && productToEdit) {
        setProductFormData({
          _id: productToEdit._id,
          name: productToEdit.name,
          description: productToEdit.description,
          category: productToEdit.category,
          subCategory: productToEdit.subCategory,
          stocks: productToEdit.stocks,
          requiredPoints: productToEdit.requiredPoints,
          image: productToEdit.image,
          imageFile: null,
        });
      } else {
        setProductFormData({
          _id: '',
          name: '',
          description: '',
          category: '',
          subCategory: '',
          stocks: 0,
          requiredPoints: 0,
          image: null,
          imageFile: null,
        });
      }
    }, [mode, productToEdit, showProductModal]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setProductFormData((prev: any) => ({
        ...prev,
        image: {
          url: url,
        },
        imageFile: file,
      }));
    };

    const validateProductForm = (): boolean => {
      if (!productFormData.name.trim()) {
        showError('Please enter a product name', { title: 'Validation' });
        return false;
      }
      if (!productFormData.description.trim()) {
        showError('Please enter a product description', {
          title: 'Validation',
        });
        return false;
      }
      if (!productFormData.category.trim()) {
        showError('Please select a category', { title: 'Validation' });
        return false;
      }
      if (!productFormData.subCategory.trim()) {
        showError('Please select a subcategory', { title: 'Validation' });
        return false;
      }
      if (productFormData.stocks < 0 || isNaN(productFormData.stocks)) {
        showError('Please enter valid stocks', { title: 'Validation' });
        return false;
      }
      if (
        productFormData.requiredPoints < 0 ||
        isNaN(productFormData.requiredPoints)
      ) {
        showError('Please enter valid required points', {
          title: 'Validation',
        });
        return false;
      }
      // if (!productFormData.image) {
      //   showError('Please enter valid stocks', { title: 'Validation' });
      //   return false;
      // }
      return true;
    };

    const buildProductFormData = (): FormData => {
      const formData = new FormData();
      formData.append('name', productFormData.name.trim());
      formData.append('description', productFormData.description.trim());
      formData.append('category', productFormData.category.trim());
      formData.append('subCategory', productFormData.subCategory.trim());
      formData.append('stocks', productFormData.stocks.toString());
      formData.append(
        'requiredPoints',
        productFormData.requiredPoints.toString()
      );

      if (
        productFormData.imageFile &&
        productFormData.imageFile instanceof File
      ) {
        formData.append('image', productFormData.imageFile);
      }

      return formData;
    };

    const handleAddProduct = async (): Promise<void> => {
      if (!validateProductForm()) {
        return;
      }

      const formData = buildProductFormData();

      try {
        const response = await authFetch('/products', {
          method: 'POST',
          body: formData,
        });
        await refetchProduct();
        success(response?.message || 'Product created', { title: 'Success' });
      } catch (error) {
        console.log(error.message);
      }
    };

    const handleUpdateProduct = async (): Promise<void> => {
      if (!validateProductForm()) {
        return;
      }

      const formData = buildProductFormData();
      try {
        const response = await authFetch(`/products/${productFormData._id}`, {
          method: 'PATCH',
          body: formData,
        });

        await refetchProduct();
        success(response.message || 'Product updated', { title: 'Success' });
      } catch (error) {
        console.log(error.message);
      }
    };

    return (
      showProductModal &&
      createPortal(
        <div className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
          <div
            className="fixed inset-0 bg-gradient-to-br top-0 bottom-0 left-0 right-0 h-full w-full from-black/70 via-black/50 to-black/70"
            onClick={() => setShowProductModal(false)}
          />

          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full mx-3 sm:mx-4 z-[10] animate-in zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="relative p-8 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 lg:p-4 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-white/30">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
                      {mode === 'Edit' ? 'Update Product' : 'Add New Product'}
                    </h3>
                    <p className="text-xs sm:text-sm text-green-50/90 mt-0.5 sm:mt-1">
                      {mode === 'Edit'
                        ? 'Update product details'
                        : 'Fill in the product information'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 sm:p-2.5 lg:p-3 rounded-xl sm:rounded-2xl backdrop-blur-sm flex items-center justify-center transition-all duration-200 flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={productFormData.name}
                      onChange={(e) =>
                        setProductFormData((prev: any) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Eco-Friendly Water Bottle"
                      className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                    />
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                      Product Description
                    </label>
                    <textarea
                      value={productFormData.description}
                      onChange={(e) =>
                        setProductFormData((prev: any) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Brief description of the product..."
                      className="w-full min-h-[80px] sm:min-h-[100px] p-3 sm:p-4 resize-none bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl text-sm sm:text-base outline-none transition-all"
                      maxLength={250}
                    />
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                      {productFormData.description.length}/250 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={productFormData.category}
                        onChange={(e) =>
                          setProductFormData((prev: any) => ({
                            ...prev,
                            category: e.target.value,
                            subcategory: '',
                          }))
                        }
                        className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl px-3 sm:px-4 bg-white text-sm sm:text-base"
                      >
                        <option value="">Select</option>
                        <option value="Agricultural">Agricultural</option>
                        <option value="Non Agricultural">
                          Non Agricultural
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                        Subcategory <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={productFormData.subCategory}
                        onChange={(e) =>
                          setProductFormData((prev: any) => ({
                            ...prev,
                            subCategory: e.target.value,
                          }))
                        }
                        className="w-full h-10 sm:h-11 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl px-3 sm:px-4 bg-white text-sm sm:text-base"
                        disabled={!productFormData.category}
                      >
                        <option value="">Select</option>
                        {productFormData.category === 'Agricultural' && (
                          <>
                            <option value="Vegetable">Vegetables</option>
                            <option value="Fertilizers">Fertilizers</option>
                            <option value="Soil">Soil</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Seedlings">Seedlings</option>
                            <option value="Herbal Plants">Herbal Plants</option>
                            <option value="Fruits">Fruits</option>
                          </>
                        )}
                        {productFormData.category === 'Non Agricultural' && (
                          <>
                            <option value="Household">
                              Eco Bags and Eco Rags
                            </option>
                            <option value="Toys">Toys</option>
                            <option value="School Supplies">
                              School Supplies
                            </option>
                            <option value="Medicines">Medicines</option>
                            <option value="Cashback">Cashback</option>
                            <option value="Books">Books</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                        Stocks <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={productFormData.stocks}
                        onChange={(e) =>
                          setProductFormData((prev: any) => ({
                            ...prev,
                            stocks: e.target.value,
                          }))
                        }
                        placeholder="0"
                        min="0"
                        className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                      />
                    </div>

                    <div>
                      <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                        Required Points <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        value={productFormData.requiredPoints}
                        onChange={(e) =>
                          setProductFormData((prev: any) => ({
                            ...prev,
                            requiredPoints: e.target.value,
                          }))
                        }
                        placeholder="0"
                        min="0"
                        className="h-10 sm:h-11 text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl px-3 sm:px-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                      Product Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="block w-full text-xs sm:text-sm text-gray-600 file:mr-3 sm:file:mr-4 file:py-2 sm:file:py-2.5 file:px-3 sm:file:px-4 file:rounded-xl file:border-0 file:text-xs sm:file:text-sm file:font-bold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/50"
                    />
                  </div>
                </div>

                {/* Right Column - Image Preview */}
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 block">
                    Image Preview
                  </label>
                  <div className="relative w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {productFormData.image ? (
                      <>
                        <ImageWithFallback
                          src={productFormData.image.url}
                          alt={productFormData.name || 'preview'}
                          className="w-full h-full object-contain"
                        />
                        {/* <img src={productFormData.image.src} alt="Product image" className='h-full w-full object-contain'/> */}
                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg shadow-lg">
                          ✓ Ready
                        </div>
                      </>
                    ) : (
                      <div className="text-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-200 flex items-center justify-center">
                          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 font-semibold">
                          No image yet
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                          Upload to preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                {mode === 'Edit' ? (
                  <Button
                    onClick={handleUpdateProduct}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
                  >
                    <PenSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                    Update Product
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddProduct}
                    className="flex-1 sm:flex-none px-5 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl shadow-lg text-sm"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 inline" />{' '}
                    Add Product
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    );
  }
);

export default AddEditProductModal;
