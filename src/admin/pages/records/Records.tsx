import useFetchData from '../../hooks/useFetchData';
import AddRecordModal from './components/AddRecordModal';
import EditRecordModal from './components/EditRecordModal';
import RecordFilter from './components/RecordFilter';
import RecordHeader from './components/RecordHeader';
import RecordTable from './components/RecordTable';
import { RecordInterface } from './Record.types';
import { useEffect, useState } from 'react';

const Records = () => {
  const [originalRecords, setOriginalRecords] = useState<RecordInterface[]>([]);
  const {
    data: recordsData,
    loading: recordsLoading,
    error: recordsError,
    refetch: refetchRecords,
  } = useFetchData<RecordInterface[] | null>('/records');

  useEffect(() => {
    if (recordsData && !recordsLoading && !recordsError) {
      setOriginalRecords(recordsData);
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
  const [deleteRecord, setDeleteRecord] = useState<RecordInterface | null>(null);

  return (
    <main className="md:p-5">
      {/* Record Header */}
      <RecordHeader 
        setOpenAddRecordModal={setOpenAddRecordModal}
        recordsData={recordsData} />

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
        refetchRecords={refetchRecords}
      />

      
    </main>
  );
};

export default Records;
