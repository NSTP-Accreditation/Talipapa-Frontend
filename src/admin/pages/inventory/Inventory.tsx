import { useEffect, useState } from 'react';
import InventoryHeader from './InventoryHeader';
import useFetchData from '@/admin/hooks/useFetchData';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import InventoryCards from './components/InventoryCards';
import InventoryProducts from './InventoryProducts';
import ResponsiveSkeleton from '@/components/ResponsiveSkeleton';
import InventoryMaterials from './InventoryMaterials';
import { useRBAC } from '../../../hooks/useRBAC';
import { Permission } from '../../../types/rbac.types';
import { ReadOnly } from '../../../components/rbac/Can';

const Inventory = () => {
  const { hasPermission } = useRBAC();
  const canManageInventory = hasPermission(Permission.MANAGE_INVENTORY);

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
  const [filteredProducts, setFilteredProducts] = useState<ProductInterface[]>(
    []
  );
  const [filteredMaterials, setFilteredMaterials] = useState<
    MaterialInterface[]
  >([]);

  useEffect(() => {
    if (productsData && !productsDataLoading && !productsDataErr) {
      setFilteredProducts(productsData);
    }

    if (materialsData && !materialsDataLoading && !materialsDataErr) {
      setFilteredMaterials(materialsData);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        <ReadOnly message="You have view-only access to Inventory. Contact a SuperAdmin to add, edit, or delete products and materials." />
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
          canManageInventory={canManageInventory}
        />

        {/* Materials Container */}
        <InventoryMaterials
          filteredMaterials={filteredMaterials}
          materialsData={materialsData}
          materialsDataError={materialsDataErr}
          refetchMaterial={refetchMaterials}
          canManageInventory={canManageInventory}
        />
      </div>
    </div>
  );
};

export default Inventory;
