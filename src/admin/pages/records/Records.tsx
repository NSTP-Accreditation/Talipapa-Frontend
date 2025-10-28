import useFetchData from '../../hooks/useFetchData'
import RecordFilter from './components/RecordFilter'
import RecordHeader from './components/RecordHeader'
import { RecordInterface } from './Record.types'
import { useEffect, useState } from 'react'

const Records = () => {
  const [ originalRecords, setOriginalRecords ] = useState<RecordInterface[]>([]);
  const { data: recordsData, loading: recordsLoading, error: recordsError, refetch: refetchRecords } = useFetchData<RecordInterface[] | null>("/records");

  useEffect(() => {
    if(recordsData && !recordsLoading && !recordsError) {
      setOriginalRecords(recordsData);
    }
  }, [recordsData, recordsLoading, recordsError])

  return (
    <main className='md:p-5'>

      {/* Record Header */}
      <RecordHeader recordsData={recordsData}/>

      {/* Enhanced Search Bar */}
      <RecordFilter originalRecords={originalRecords} recordsData={recordsData} setOriginalRecords={setOriginalRecords} refetchRecords={refetchRecords}/>

    </main>
  )
}

export default Records