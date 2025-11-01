import { RecordInterface } from '@/types/global.types';
import useFetchData from '../../hooks/useFetchData';
import AddRecordModal from './components/AddRecordModal';
import DeleterecordModal from './components/DeleterecordModal';
import EditRecordModal from './components/EditRecordModal';
import RecordFilter from './components/RecordFilter';
import RecordHeader from './components/RecordHeader';
import RecordTable from './components/RecordTable';
import { useEffect, useState } from 'react';

const Records = () => {
  const [originalRecords, setOriginalRecords] = useState<RecordInterface[]>([]);
  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useFetchData<RecordInterface[] | null>('/records?residentStatus=resident');

  console.log(recordsData);
  
  useEffect(() => {
    if (recordsData && !recordsLoading && !recordsError) {
      // Merge server data with local originalRecords to preserve local edits
      setOriginalRecords((prev) => {
        // if no local prev, just use server data
        if (!prev || prev.length === 0) return recordsData as RecordInterface[];

        // map server records and prefer local lastName when it differs (local edit)
        const merged = (recordsData as RecordInterface[]).map((serverRec) => {
          const local = prev.find((p) => p._id === serverRec._id);
          if (!local) return serverRec;
          // preserve local lastName if it differs from server
          if (local.lastName && local.lastName !== serverRec.lastName) {
            return { ...serverRec, lastName: local.lastName };
          }
          return serverRec;
        });

        return merged;
      });
    }
  }, [recordsData, recordsLoading, recordsError]);

  // Table Configuration
  const recordsPerPage = 10;
  const totalPages = Math.ceil(originalRecords.length / recordsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const showingRecords = originalRecords.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // State for modals
  const [openAddRecordModal, setOpenAddRecordModal] = useState(false);
  const [editRecord, setEditRecord] = useState<RecordInterface | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<RecordInterface | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-3 sm:p-5 lg:p-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Record Header */}
        <RecordHeader
          setOpenAddRecordModal={setOpenAddRecordModal}
          recordsData={recordsData}
        />

        {/* Enhanced Search Bar */}
        <RecordFilter
          originalRecords={originalRecords}
          recordsData={recordsData}
          setOriginalRecords={setOriginalRecords}
          refetchRecords={refetchRecords}
        />

        {/* Record Table */}
        <RecordTable
          showingRecords={showingRecords}
          setEditRecord={setEditRecord}
          setDeleteRecord={setDeleteRecord}
          startIndex={startIndex}
          recordsPerPage={recordsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />

        {/* MODALS */}
        {/* ADD MODAL */}
        <AddRecordModal
          openAddRecordModal={openAddRecordModal}
          setOpenAddRecordModal={setOpenAddRecordModal}
          refetchRecords={refetchRecords}
        />

        {/* EDIT MODAL */}
        <EditRecordModal
          editRecord={editRecord}
          setEditRecord={setEditRecord}
          setOriginalRecords={setOriginalRecords}
          refetchRecords={refetchRecords}
        />

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
