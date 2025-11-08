import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import LeafletMap from '../LeafletMap';
import { Farm } from '../MapDropdown';
import { Dispatch, SetStateAction } from 'react';

type GreenPageMapProps = {
  farmsData: { success: boolean; data: Farm[] } | undefined;
  selectedFarm: Farm | null;
  setSelectedFarm: Dispatch<SetStateAction<Farm | null>>;
};

const GreenPageMap = ({
  farmsData,
  selectedFarm,
  setSelectedFarm,
}: GreenPageMapProps) => {

  return (
    <div className="lg:col-span-1">
      <Card className="rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 border-b-2 border-green-500 pb-4">
          <CardTitle className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
            </div>
            <span>Interactive Farm Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-gradient-to-br from-gray-50 to-white">
          <div style={{ height: 380 }} className="relative">
            <LeafletMap
              farmsData={farmsData?.data || []}
              selectedFarm={selectedFarm}
              onSelectFarm={(f: any) => setSelectedFarm(f)}
            />
          </div>
          {selectedFarm && (
            <div className="p-4 border-t-2 border-gray-200 bg-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">
                  Selected: {selectedFarm.name}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GreenPageMap;
