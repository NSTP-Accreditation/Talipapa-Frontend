import dayjs from "dayjs"
import { RecordInterface } from "../Record.types"
import { Button } from "@/components/ui"
import { Edit, Search, Trash2 } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

type RecordTableType = {
  originalRecords: RecordInterface[],
  setOpenEditModal: Dispatch<SetStateAction<RecordInterface>>,
  setOpenDeleteModal: Dispatch<SetStateAction<RecordInterface>>,
}

const RecordTable = ({ originalRecords, setOpenEditModal, setOpenDeleteModal } : RecordTableType ) => {
  return (
    <section id="record_table">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 border-gray-200">
        <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50">
          <table className="w-full text-xs sm:text-sm min-w-[700px]">
            <thead className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
              <tr>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold text-green-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {originalRecords.length > 0 ? (
                originalRecords.map((record, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-50 transition-colors duration-150"
                  >
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className="text-xs sm:text-sm font-bold text-green-700 bg-green-100 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-200">
                        {record?._id}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                          {record?.firstName?.charAt(0)}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-900">
                          {record?.firstName} {record?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`text-xs sm:text-sm font-semibold text-gray-900`}
                      >
                        {record?.age}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-lg sm:text-2xl">⭐</span>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {record?.points}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400">📍</span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium max-w-[150px] sm:max-w-none truncate sm:whitespace-normal">
                          {record?.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-gray-400">📅</span>
                        <span className="text-xs sm:text-sm text-gray-700 font-medium">
                          <span className="hidden sm:inline">
                            {dayjs(record?.createdAt).format(
                              'YYYY-MM-DD | h:mm:ss A'
                            )}
                          </span>
                          <span className="sm:hidden">
                            {dayjs(record?.createdAt).format('MM/DD/YY')}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => setOpenEditModal(record)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button
                          onClick={() => setOpenDeleteModal(record)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1 text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-2 sm:px-6 py-8 sm:py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 sm:gap-3">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">
                        No records found.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400">
                        Try adjusting your search criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="block sm:hidden text-xs text-gray-400 mt-2 p-2 text-center">
            Swipe left/right to see more columns
          </div>
        </div>
      </div>


    </section>
  )
}

export default RecordTable