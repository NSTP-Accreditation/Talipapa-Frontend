import useFetchData from '../hooks/useFetchData'
import RecordHeader from './records/components/RecordHeader'
import { RecordInterface } from './records/Record.types'
import { useEffect, useState } from 'react'

const Records = () => {
  const [ originalRecords, setOriginalRecords ] = useState<RecordInterface[]>([]);
  const { data: recordsData, loading: recordsLoading, error: recordsError } = useFetchData<RecordInterface[] | null>("/records");

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
      

    </main>
  )
}

export default Records