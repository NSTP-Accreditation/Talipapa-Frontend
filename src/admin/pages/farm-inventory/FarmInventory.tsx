import useFetchData from '@/admin/hooks/useFetchData';
import FarmInventoryCards from './components/FarmInventoryCards';
import FarmInventoryHeader from './FarmInventoryHeader';
import FarmInventoryItems from './FarmInventoryItems';
import { useEffect, useState } from 'react';
import AddEditFarmItemModal from './components/AddEditFarmItemModal';
import { FarmItemInterface } from '@/types/global.types';
import DeleteFarmItemModal from './components/DeleteFarmItemModal';
import { useRBAC } from '../../../hooks/useRBAC';
import { Permission } from '../../../types/rbac.types';
import { ReadOnly } from '../../../components/rbac/Can';

const FarmInventory = () => {
  // RBAC: Check if user can manage farm inventory
  const { hasPermission } = useRBAC();
  const canManageFarmInventory = hasPermission(
    Permission.MANAGE_FARM_INVENTORY
  );

  // fetch Data
  const {
    data: farmItemsData,
    loading: farmItemsDataLoading,
    error: farmItemsDataErr,
    refetch: refetchFarmItems,
  } = useFetchData('/farm-inventory');

  const [showAddEditFarmItemModal, setShowAddEditFarmItemModal] =
    useState<boolean>(false);
  const [showDeleteFarmItemModal, setShowDeleteFarmItemModal] =
    useState<boolean>(false);
  const [mode, setMode] = useState<'Add' | 'Edit'>('Add');
  const [itemToUpdateOrDelete, setItemToUpdateOrDelete] =
    useState<FarmItemInterface>(null);

  const [filteredFarmItems, setFilteredFarmItems] = useState<
    FarmItemInterface[]
  >([]);

  useEffect(() => {
    if (farmItemsData || farmItemsDataLoading || farmItemsDataErr) {
      setFilteredFarmItems(farmItemsData);
    }
  }, [farmItemsData, farmItemsDataLoading, farmItemsDataErr]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-6 sm:space-y-8">
        <ReadOnly message="You have view-only access to Farm Inventory. Contact a SuperAdmin to add, edit, or delete farm items." />
        {/* Header and Search bar */}
        <FarmInventoryHeader
          farmItemsData={farmItemsData}
          setFilteredFarmItems={setFilteredFarmItems}
        />

        {/* Cards */}
        <FarmInventoryCards farmItemsData={farmItemsData} />

        <FarmInventoryItems
          farmItemsData={farmItemsData}
          filteredFarmItems={filteredFarmItems}
          canManageFarmInventory={canManageFarmInventory}
          onAddItem={() => {
            setMode('Add');
            setShowAddEditFarmItemModal(true);
          }}
          onUpdateItem={(item) => {
            setItemToUpdateOrDelete(item);
            setMode('Edit');
            setShowAddEditFarmItemModal(true);
          }}
          onDeleteItem={(item) => {
            setItemToUpdateOrDelete(item);
            setShowDeleteFarmItemModal(true);
          }}
        />

        {/* Add/Edit Farm Items - Only for users with manage permission */}
        {canManageFarmInventory && (
          <AddEditFarmItemModal
            open={showAddEditFarmItemModal}
            onClose={() => setShowAddEditFarmItemModal(false)}
            mode={mode}
            itemToUpdateOrDelete={itemToUpdateOrDelete}
            refetchFarmItems={refetchFarmItems}
          />
        )}

        {/* Delete Farm Item - Only for users with manage permission */}
        {canManageFarmInventory && (
          <DeleteFarmItemModal
            isOpen={showDeleteFarmItemModal}
            itemToDelete={itemToUpdateOrDelete}
            onClose={() => setItemToUpdateOrDelete(null)}
            refetch={refetchFarmItems}
          />
        )}
      </div>
    </div>
  );
};

export default FarmInventory;
