import { useEffect, useState } from 'react';
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

  // Variables
  const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialInterface[]>([]);
  
  useEffect(() => {
    if(productsData && !productsDataLoading && !productsDataErr) {
      setFilteredProducts(productsData)
    }

    if(materialsData && !materialsDataLoading && !materialsDataErr) {
      setFilteredMaterials(materialsData)
    }
    
  }, [productsData, productsDataLoading, productsDataErr, materialsData, materialsDataLoading, materialsDataErr])

  if (productsDataLoading || materialsDataLoading) {
    return <ResponsiveSkeleton page="inventory" />;
  }

  return (
    <main className="p-5 grid gap-6">
      {/* Inventory Header */}
      <InventoryHeader 
        productsData={productsData}
        materialsData={materialsData}
        setFilteredProducts={setFilteredProducts}
        setFilteredMaterials={setFilteredMaterials}
      />

      {/* Inventory Cards */}
      <InventoryCards
        productsData={productsData}
        materialsData={materialsData}
      />

      {/* Products Container */}
      <InventoryProducts
        filteredProducts={filteredProducts}
        productsData={productsData}
        productsDataError={productsDataErr}
        refetchProduct={refetchProduct}
      />

      {/* Materials Container */}
      <InventoryMaterials 
        filteredMaterials={filteredMaterials}
        materialsData={materialsData}
        materialsDataError={materialsDataErr}
        refetchMaterial={refetchMaterials}
      />

    </main>
  );
};

export default Inventory;
