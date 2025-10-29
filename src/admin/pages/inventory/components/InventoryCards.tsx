import { Card, CardContent } from '@/components/ui';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import {
  AlertTriangle,
  Box,
  Package,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type InventoryCardsType = {
  productsData: ProductInterface[];
  materialsData: MaterialInterface[];
};

const InventoryCards = ({
  productsData,
  materialsData,
}: InventoryCardsType) => {
  const lowStockCount = productsData?.filter(
    (p) => (p.stocks || 0) < 10
  )?.length;
  const outOfStockCount = productsData?.filter(
    (p) => (p.stocks || 0) === 0
  )?.length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-600" />
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-green-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-green-700" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Products
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {productsData?.length}
                </p>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600" />
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 group-hover:scale-110 transition-transform duration-300">
                <Box className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-emerald-700" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Materials
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {materialsData?.length}
                </p>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-600" />
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-700" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-wide inline">
                  Low Stock
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {lowStockCount}
                </p>
              </div>
            </div>
            <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-rose-600" />
        <CardContent className="p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2.5 sm:p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-br from-red-50 to-red-100 group-hover:scale-110 transition-transform duration-300">
                <Box className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-red-700" />
              </div>
              <div>
                <p className="text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-wide inline-block">
                  Out of Stock
                </p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">
                  {outOfStockCount}
                </p>
              </div>
            </div>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default InventoryCards;
