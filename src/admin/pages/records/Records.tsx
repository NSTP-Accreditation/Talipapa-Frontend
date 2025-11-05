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
  const [originalRecords, setOriginalRecords] = useState<RecordInterface[]>([]);
  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useFetchData<PaginatedResponse<RecordInterface> | null>(
    '/records?residentStatus=resident'
  );

  useEffect(() => {
    if (recordsData && !recordsLoading && !recordsError) {
      // Merge server data with local originalRecords to preserve local edits
      setOriginalRecords(recordsData.data);
    }
  }, [recordsData, recordsLoading, recordsError]);

  // Table Configuration
  const [searchLoading, setSearchLoading] = useState(false);

  // State for modals
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  const [editRecord, setEditRecord] = useState<RecordInterface | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<RecordInterface | null>(
    null
  );

  if (!recordsData) return;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Record Header */}
        <RecordHeader
          setOpenAddRecordModal={setOpenAddRecordModal}
          recordsData={recordsData.data}
        />

        {/* Enhanced Search Bar */}
        <RecordFilter
          originalRecords={originalRecords}
          recordsData={recordsData.data}
          setOriginalRecords={setOriginalRecords}
          refetchRecords={refetchRecords}
          setSearchLoading={setSearchLoading}
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
        />

        {/* EDIT MODAL */}
        {editRecord && (
          <EditRecordModal
            editRecord={editRecord}
            setEditRecord={setEditRecord}
            setOriginalRecords={setOriginalRecords}
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
