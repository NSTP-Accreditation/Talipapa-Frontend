import { Button } from '@/components/ui';
import { UserRoundPen, Users, FileText, Filter, Subtitles } from 'lucide-react';
import { RecordInterface } from '@/types/global.types';
import { Dispatch, SetStateAction } from 'react';
import ExcelExportButton from '@/components/ui/ExcelExportButton';
import { PaginatedResponse } from '@/types/pagination';

type RecordHeaderProps = {
  title: string,
  subTitle: string,
  recordsData: PaginatedResponse<RecordInterface> | null;
  setOpenAddRecordModal: Dispatch<SetStateAction<boolean>>;
};

const RecordHeader = ({
  title,
  subTitle,
  recordsData,
  setOpenAddRecordModal,
}: RecordHeaderProps) => {
  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
      </div>

      <div className="relative p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 flex-1">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
              <UserRoundPen className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
                {subTitle}
              </p>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>
                    {recordsData.totalItems || 0}{' '}
                    {recordsData.totalItems === 1 ? 'Resident' : 'Residents'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Excel Export</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Search & Filter</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Add Residents and Download button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
            <Button
              onClick={() => setOpenAddRecordModal(true)}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base flex items-center justify-center gap-2 rounded-xl font-bold shadow-md hover:shadow-xl transition-all min-h-[44px]"
            >
              <span className="text-lg sm:text-xl">+</span>
              <span>Add {title.slice(0, -1)}</span>
            </Button>

            <ExcelExportButton
              records={recordsData.data || []}
              recordType="resident"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordHeader;
