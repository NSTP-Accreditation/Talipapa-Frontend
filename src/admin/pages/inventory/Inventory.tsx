import { useState } from 'react';
import InventoryHeader from './components/InventoryHeader';
import useFetchData from '@/admin/hooks/useFetchData';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import InventoryCards from './components/InventoryCards';
import InventoryProducts from './components/InventoryProducts';
import ResponsiveSkeleton from '@/components/ResponsiveSkeleton';
import InventoryMaterials from './components/InventoryMaterials';

const Inventory = () => {
  // FETCH NEEDED DATA
  const {
    data: productsData,
    loading: productsDataLoading,
    error: productsDataErr,
    refetch: refetchProduct,
  } = useFetchData<ProductInterface[]>('/products');
  const {
    data: materialsData,
    loading: materialsDataLoading,
    error: materialsDataErr,
    refetch: refetchMaterials,
  } = useFetchData<MaterialInterface[]>('/materials');

  const [search, setSearch] = useState('');

  if (productsDataLoading || materialsDataLoading) {
    return <ResponsiveSkeleton page="inventory" />;
  }

  return (
    <main className="p-5 grid gap-6">
      {/* Inventory Header */}
      <InventoryHeader search={search} setSearch={setSearch} />

      {/* Inventory Cards */}
      <InventoryCards
        productsData={productsData}
        materialsData={materialsData}
      />

      {/* Products Container */}
      <InventoryProducts
        productsData={productsData}
        productsDataError={productsDataErr}
      />

      {/* Materials Container */}
      <InventoryMaterials 
        materialsData={materialsData}
        materialsDataError={materialsDataErr}
      />

    </main>
  );
};

export default Inventory;
