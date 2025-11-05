import { RecordInterface } from '@/types/global.types';
import useFetchData from '../../hooks/useFetchData';
import AddRecordModal from './components/AddRecordModal';
import DeleterecordModal from './components/DeleterecordModal';
import EditRecordModal from './components/EditRecordModal';
import RecordFilter from './components/RecordFilter';
import RecordHeader from './components/RecordHeader';
import RecordTable from './components/RecordTable';
import { useEffect, useState } from 'react';
import { ResponsiveSkeleton } from '../../../components/ResponsiveSkeleton';
import { PaginatedResponse } from '@/types/pagination';

const Records = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useFetchData<PaginatedResponse<RecordInterface> | null>(
    `/records?residentStatus=resident&page=${page}`
  );

  const [searchLoading, setSearchLoading] = useState(false);

  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  const [editRecord, setEditRecord] = useState<RecordInterface | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<RecordInterface | null>(
    null
  );

  if (recordsLoading) return <ResponsiveSkeleton page="records" />;

  if (!recordsData) return;

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
          setSearchTerm={setSearchTerm}
          recordsData={recordsData}
          refetchRecords={refetchRecords}
          setSearchLoading={setSearchLoading}
          residentStatus="resident"
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
