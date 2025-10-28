import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Award } from 'lucide-react';
import { TradingStatisticsProps } from '../TradingStatistics.types';


const Top5RecordCard = ({ topList, topLoading } : TradingStatisticsProps & { topLoading: boolean }) => {
  return (
    <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          Top 5 Points Holders
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="w-full overflow-x-auto">
          {topLoading ? (
            <div className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
              Loading...
            </div>
          ) : topList.length > 0 ? (
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#1b4c2e]/30">
                  <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                    Rank
                  </th>
                  <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                    Record ID
                  </th>
                  <th className="text-left p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                    Name
                  </th>
                  <th className="text-right p-2 sm:p-3 font-bold text-[#1b4c2e] text-xs sm:text-base">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {topList.map((holder: any, idx: number) => {
                  const points = holder.points || 0;
                  return (
                    <tr
                      key={holder._id || idx}
                      className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200"
                    >
                      <td className="p-2 sm:p-3">
                        <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#1b4c2e] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-lg">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white shadow-md">
                          {holder.recordId}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-gray-800 font-semibold text-xs sm:text-sm">
                        <div
                          className="truncate max-w-[120px] sm:max-w-none"
                          title={`${holder.firstName} ${holder.middleName ? holder.middleName + ' ' : ''}${holder.lastName}`}
                        >
                          {holder.firstName}{' '}
                          {holder.middleName ? holder.middleName + ' ' : ''}
                          {holder.lastName}
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-right">
                        <span className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#1b4c2e]/20 to-[#1b4c2e]/10 text-[#1b4c2e] border border-[#1b4c2e]/30">
                          {points} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-xs sm:text-sm text-gray-500 text-center py-6 sm:py-8">
              No records found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Top5RecordCard;
