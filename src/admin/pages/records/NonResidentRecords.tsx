import React, { useEffect, useState } from 'react';
import useFetchData from '../../hooks/useFetchData';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import EditRecordModal from './components/EditRecordModal';
import DeleterecordModal from './components/DeleterecordModal';
import RecordTable from './components/RecordTable';
import AddRecordModal from './components/AddRecordModal';
import RecordFilter from './components/RecordFilter';
import { RecordInterface } from '@/types/global.types';
import { PaginatedResponse } from '@/types/pagination';
import RecordHeader from './components/RecordHeader';
import { useSearchRecords } from '@/admin/hooks/useSearchRecord';

const NonResidentRecords: React.FC = () => {
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
  } = useFetchData<PaginatedResponse<RecordInterface> | null>(getFetchUrl("non-resident"));

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
  if (recordsLoading) return <ResponsiveSkeleton page="records" />;

  if(!recordsData) return;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <RecordHeader
            title="Non-Resident Records"
            subTitle="Manage and track non-resident information"
            setOpenAddRecordModal={setOpenAddRecordModal}
            recordsData={recordsData}
          />

          {/* Search */}
          <RecordFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            isSearching={isSearching}
            recordCount={recordsData.data.length}
            totalRecords={recordsData.totalItems}
          />

          {/* Table (resident table component to keep behavior consistent) */}
          {searchLoading ? (
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
        </div>
      </div>

      {openAddRecordModal && (
        <AddRecordModal
          openAddRecordModal={openAddRecordModal}
          setOpenAddRecordModal={setOpenAddRecordModal}
          refetchRecords={refetchRecords}
          isResident={false}
        />
      )}
      {/* EDIT & DELETE MODALS (reuse resident components) */}
      <EditRecordModal
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        refetchRecords={refetchRecords}
      />

      <DeleterecordModal
        deleteRecord={deleteRecord}
        setDeleteRecord={setDeleteRecord}
        refetchRecords={refetchRecords}
      />
    </>
  );
};

export default NonResidentRecords;
