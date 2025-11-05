import { useEffect, useState } from 'react';
import InventoryHeader from './InventoryHeader';
import useFetchData from '@/admin/hooks/useFetchData';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import InventoryCards from './components/InventoryCards';
import InventoryProducts from './InventoryProducts';
import ResponsiveSkeleton from '@/components/ResponsiveSkeleton';
import InventoryMaterials from './InventoryMaterials';
import { PaginatedResponse } from '@/types/pagination';

const Inventory = () => {
  // FETCH NEEDED DATA
  const {
    data: productsData,
    loading: productsDataLoading,
    error: productsDataErr,
    refetch: refetchProduct,
  } = useFetchData<PaginatedResponse<ProductInterface>>('/products');
  const {
    data: materialsData,
    loading: materialsDataLoading,
    error: materialsDataErr,
    refetch: refetchMaterials,
  } = useFetchData<PaginatedResponse<MaterialInterface>>('/materials');

  // Variables
  const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>(
    []
  );
  const [filteredMaterials, setFilteredMaterials] = useState<
    MaterialInterface[]
  >([]);

  useEffect(() => {
    if (productsData && !productsDataLoading && !productsDataErr) {
      setFilteredProducts(productsData.data);
    }

    if (materialsData && !materialsDataLoading && !materialsDataErr) {
      setFilteredMaterials(materialsData.data);
    }
  }, [
    productsData,
    productsDataLoading,
    productsDataErr,
    materialsData,
    materialsDataLoading,
    materialsDataErr,
  ]);

  if (productsDataLoading || materialsDataLoading) {
    return <ResponsiveSkeleton page="inventory" />;
  }

  if(!productsData) return;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        {/* Inventory Header */}
        <InventoryHeader
          productsData={productsData.data}
          materialsData={materialsData.data}
          setFilteredProducts={setFilteredProducts}
          setFilteredMaterials={setFilteredMaterials}
        />

        {/* Inventory Cards */}
        <InventoryCards
          productsData={productsData.data}
          materialsData={materialsData.data}
        />

        {/* Products Container */}
        <InventoryProducts
          filteredProducts={filteredProducts}
          productsData={productsData.data}
          productsDataError={productsDataErr}
          refetchProduct={refetchProduct}
        />

        {/* Materials Container */}
        <InventoryMaterials
          filteredMaterials={filteredMaterials}
          materialsData={materialsData.data}
          materialsDataError={materialsDataErr}
          refetchMaterial={refetchMaterials}
        />
      </div>
    </div>
  );
};

export default Inventory;
