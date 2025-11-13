import { Card, CardContent } from '@/components/ui';
import { FarmItemInterface } from '@/types/global.types';
import {
  AlertTriangle,
  Apple,
  Leaf,
  Sprout,
  Trees,
  TrendingUp,
  X,
} from 'lucide-react';
import { useMemo } from 'react';

type FarmInventoryCardsProps = {
  farmItemsData: FarmItemInterface[];
};

const FarmInventoryCards = ({ farmItemsData }: FarmInventoryCardsProps) => {
  const lowStockCount = useMemo(
    () => farmItemsData?.filter((item) => item.stocks <= 5)?.length,
    [farmItemsData]
  );
  const outOfStockCount = useMemo(
    () => farmItemsData?.filter((item) => item.stocks === 0)?.length,
    [farmItemsData]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Vegetables: 0,
      'Herbal Plants': 0,
      Fruits: 0,
      Seedlings: 0,
      Trees: 0,
    };
    farmItemsData?.forEach((item) => {
      if (item.subCategory && counts.hasOwnProperty(item.subCategory)) {
        counts[item.subCategory]++;
      }
    });
    return counts;
  }, [farmItemsData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex place-content-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600" />
        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                <Sprout className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-700" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Total Items
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {farmItemsData?.length}
                </p>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex place-content-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-600" />
        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-yellow-100 to-orange-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-orange-700" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Low Stock
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {lowStockCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex place-content-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-600" />
        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1">
              <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-red-100 to-pink-50 rounded-xl sm:rounded-2xl shadow-inner flex-shrink-0">
                <X className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-700" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Out of Stock
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {outOfStockCount}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex place-content-center lg:col-span-2">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600" />
        <CardContent className="p-3 sm:p-4 lg:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                By Category
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-green-600" />
                  <span className="font-medium">
                    {categoryCounts.Vegetables}
                  </span>
                  <span className="text-gray-500">Vegetables</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-green-600" />
                  <span className="font-medium">
                    {categoryCounts['Herbal Plants']}
                  </span>
                  <span className="text-gray-500">Herbs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Apple className="w-3 h-3 text-red-600" />
                  <span className="font-medium">{categoryCounts.Fruits}</span>
                  <span className="text-gray-500">Fruits</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-600" />
                  <span className="font-medium">
                    {categoryCounts.Seedlings}
                  </span>
                  <span className="text-gray-500">Seedlings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trees className="w-3 h-3 text-green-700" />
                  <span className="font-medium">{categoryCounts.Trees}</span>
                  <span className="text-gray-500">Trees</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmInventoryCards;
