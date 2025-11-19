import ImageWithFallback from '@/components/ImageWithFallback';
import { Button, Card, CardContent, Input } from '@/components/ui';
import { ProductInterface } from '@/types/global.types';
import { Edit, Package, Plus, Tag, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import AddEditProductModal from './components/AddEditProductModal';
import DeleteProductMaterialModal from './components/DeleteProductModal';

type InventoryProductsProps = {
  filteredProducts: ProductInterface[];
  productsData: ProductInterface[];
  productsDataError: string | null;
  refetchProduct: () => Promise<ProductInterface[]>;
  canManageInventory: boolean;
};

const InventoryProducts = ({
  filteredProducts,
  productsData,
  productsDataError,
  refetchProduct,
  canManageInventory,
}: InventoryProductsProps) => {
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [mode, setMode] = useState<'Add' | 'Edit'>('Add');
  const [productToEdit, setProductToEdit] = useState<ProductInterface | null>(
    null
  );

  const [productToDelete, setProductToDelete] =
    useState<ProductInterface | null>(null);

  if (productsDataError && !productsData) {
    return <p>Failed to fetch products data.</p>;
  }

  const handleEditProduct = (product: ProductInterface) => {
    setShowProductModal(true);
    setMode('Edit');
    setProductToEdit(product);
  };

  if (!productsData) return null;

  return (
    <>
      {/* Products Modal */}
      <section className="space-y-4 lg:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full" />
              Products
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-3 sm:ml-4">
              Showing {filteredProducts.length} of {productsData.length}{' '}
              products
            </p>
          </div>

          {canManageInventory && (
            <div className="flex items-center gap-3">
              {/* Subcategory filter - placed left of Add Product */}
              <Button
                onClick={() => {
                  setShowProductModal(true);
                  setMode('Add');
                  setProductToEdit(null);
                }}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white inline-flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl shadow-lg shadow-green-600/30 hover:shadow-xl hover:shadow-green-600/40 transition-all duration-200 font-bold hover:scale-[1.02] active:scale-[0.98] text-sm lg:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> Add Product
              </Button>
            </div>
          )}
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
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search or add a new product
                  </p>
                </div>
              ) : (
                filteredProducts.map((product, idx) => (
                  <div
                    key={product._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 lg:p-6 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 group gap-3 sm:gap-4"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 lg:gap-5 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md group-hover:shadow-lg transition-shadow duration-200 ring-2 ring-white">
                          <ImageWithFallback
                            src={product.image.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                          {idx + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg group-hover:text-green-700 transition-colors duration-200 break-words">
                          {product.name}
                        </div>

                        {product.description && (
                          <div className="mt-2 bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-2.5 lg:p-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {product.description}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                          <div className="text-[10px] sm:text-xs text-gray-400 font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded break-all">
                            {product._id}
                          </div>
                          {product.category && (
                            <div className="text-[10px] sm:text-xs font-semibold text-green-700 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1">
                              <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="break-words">
                                {product.category}
                              </span>
                            </div>
                          )}
                          <div
                            className={`text-[10px] sm:text-xs font-semibold  px-1.5 sm:px-2 py-0.5 sm:py-1 rounded ${product.stocks === 0 ? 'bg-red-100' : product.stocks <= 5 ? 'bg-yellow-100' : 'bg-green-50 text-green-700'}`}
                          >
                            Stock: {product.stocks}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0 self-end sm:self-center">
                      <div className="text-xs sm:text-sm font-bold text-green-700 bg-green-50 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg whitespace-nowrap">
                        {product.requiredPoints} pts
                      </div>
                      {canManageInventory ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                          >
                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setProductToDelete(product)}
                            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">
                          View Only
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Add/Edit Product Modal */}
      {canManageInventory && (
        <>
          <AddEditProductModal
            showProductModal={showProductModal}
            setShowProductModal={setShowProductModal}
            mode={mode}
            productToEdit={productToEdit}
            refetchProduct={refetchProduct}
          />

          {/* Delete Product Modal */}
          <DeleteProductMaterialModal
            itemToDelete={productToDelete}
            setItemToDelete={setProductToDelete}
            onClose={() => setProductToDelete(null)}
            refetch={refetchProduct}
            type="Product"
          />
        </>
      )}
    </>
  );
};

export default InventoryProducts;
