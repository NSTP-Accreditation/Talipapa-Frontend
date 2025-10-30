import useFetchData from '@/admin/hooks/useFetchData';
import FarmInventoryCards from './components/FarmInventoryCards';
import FarmInventoryHeader from './FarmInventoryHeader';
import FarmInventoryItems from './FarmInventoryItems';
import { useEffect, useState } from 'react';
import AddEditFarmItemModal from './components/AddEditFarmItemModal';
import { FarmItemInterface } from '@/types/global.types';

const FarmInventory = () => {
  // fetch Data
  const {
    data: farmItemsData,
    loading: farmItemsDataLoading,
    error: farmItemsDataErr,
    refetch: refetchFarmItems,
  } = useFetchData('/farm-inventory');

  const [showAddEditFarmItemModal, setShowAddEditFarmItemModal] = useState<boolean>(false);
  const [mode,setMode] = useState<"Add" | "Edit">("Add");
  const [itemToUpdateOrDelete, setItemToUpdateOrDelete] = useState<FarmItemInterface>(null);

  const [filteredFarmItems, setFilteredFarmItems] = useState<FarmItemInterface[]>([]);

  useEffect(() => {
    if(farmItemsData || farmItemsDataLoading || farmItemsDataErr) {
      setFilteredFarmItems(farmItemsData)
    }
  }, [farmItemsData, farmItemsDataLoading, farmItemsDataErr])

  return (
    <main className="p-5 grid gap-6">
      {/* Header and Search bar */}
      <FarmInventoryHeader />

      {/* Cards */}
      <FarmInventoryCards farmItemsData={farmItemsData} />

      <FarmInventoryItems
        farmItemsData={farmItemsData}
        filteredFarmItems={filteredFarmItems}
        onAddItem={() => {
          setShowAddEditFarmItemModal(true);
          setMode("Add");
        }}
      />

      {/* Add/Edit Farm Items */}
      <AddEditFarmItemModal 
        open={showAddEditFarmItemModal}
        onClose={() => setShowAddEditFarmItemModal(false)}
        mode={mode}
        itemToUpdateOrDelete={itemToUpdateOrDelete}
        refetchFarmItems={refetchFarmItems}
      />

    </main>
  );
};

export default FarmInventory;
