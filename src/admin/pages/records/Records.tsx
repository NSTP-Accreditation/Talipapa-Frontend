import { RecordInterface } from '@/types/global.types';
import useFetchData from '../../hooks/useFetchData';
import AddRecordModal from './components/AddRecordModal';
import DeleterecordModal from './components/DeleterecordModal';
import EditRecordModal from './components/EditRecordModal';
import RecordFilter from './components/RecordFilter';
import RecordHeader from './components/RecordHeader';
import RecordTable from './components/RecordTable';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { PaginatedResponse } from '@/types/pagination';
import { debounce } from 'lodash';
import { useSearchRecords } from '@/admin/hooks/useSearchRecord';

const Records = () => {
  const {
    page,
    setPage,
    searchTerm,
    isSearching,
    handleSearchChange,
    handleClearSearch,
    getFetchUrl,
  } = useSearchRecords();

  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useFetchData<PaginatedResponse<RecordInterface> | null>(getFetchUrl("resident"));

  const [searchLoading, setSearchLoading] = useState(false);
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  const [editRecord, setEditRecord] = useState<RecordInterface | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<RecordInterface | null>(null);

  useEffect(() => {
    if (!recordsLoading) {
      setSearchLoading(false);
    }
  }, [recordsLoading]);

  useEffect(() => {
    if (isSearching) {
      setSearchLoading(true);
    }
  }, [isSearching]);

  if (recordsLoading && !searchLoading) return <ResponsiveSkeleton page="records" />;
  if (!recordsData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Record Header */}
        <RecordHeader
          title="Resident Records"
          subTitle="Manage and track resident information"
          setOpenAddRecordModal={setOpenAddRecordModal}
          recordsData={recordsData}
        />

        {/* Enhanced Search Bar */}
        <RecordFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          isSearching={isSearching}
          recordCount={recordsData.data.length}
          totalRecords={recordsData.totalItems}
        />

        {/* Record Table (show skeleton while server search is running) */}
        {recordsLoading || searchLoading ? (
          <ResponsiveSkeleton page="records" />
        ) : (
          <RecordTable
            recordsData={recordsData}
            setEditRecord={setEditRecord}
            setDeleteRecord={setDeleteRecord}
            page={page}
            setPage={setPage}
          />
        )}

        {/* MODALS */}
        {/* ADD MODAL */}
        <AddRecordModal
          openAddRecordModal={openAddRecordModal}
          setOpenAddRecordModal={setOpenAddRecordModal}
          refetchRecords={refetchRecords}
          isResident={true}
        />

        {/* EDIT MODAL */}
        {editRecord && (
          <EditRecordModal
            editRecord={editRecord}
            setEditRecord={setEditRecord}
            refetchRecords={refetchRecords}
          />
        )}

        <DeleterecordModal
          deleteRecord={deleteRecord}
          setDeleteRecord={setDeleteRecord}
          refetchRecords={refetchRecords}
        />
      </div>
    </div>
  );
};

export default Records;
