import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { TrendingUp } from 'lucide-react';
import { TradingStatisticsProps } from '../TradingStatistics.types';

const TradingSummaryCard = ({
  recordsData,
  recordsToday,
  totalPoints,
}: TradingStatisticsProps) => {
  return (
    <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          Trading Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="space-y-3 sm:space-y-5">
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#1b4c2e]/10 to-[#1b4c2e]/5 rounded-lg sm:rounded-xl border-l-4 border-[#1b4c2e] hover:shadow-md transition-shadow duration-200">
            <span className="text-gray-700 font-semibold text-sm sm:text-base">
              Total Records
            </span>
            <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#1b4c2e]">
              {recordsData?.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#2d6b47]/10 to-[#2d6b47]/5 rounded-lg sm:rounded-xl border-l-4 border-[#2d6b47] hover:shadow-md transition-shadow duration-200">
            <span className="text-gray-700 font-semibold text-sm sm:text-base">
              Records Created Today
            </span>
            <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#2d6b47]">
              {recordsToday?.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#3d7b57]/10 to-[#3d7b57]/5 rounded-lg sm:rounded-xl border-l-4 border-[#3d7b57] hover:shadow-md transition-shadow duration-200">
            <span className="text-gray-700 font-semibold text-sm sm:text-base">
              Total Points
            </span>
            <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-[#3d7b57]">
              {totalPoints}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingSummaryCard;
