import useFetchData from '@/admin/hooks/useFetchData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { ProductInteface } from '@/types/global.types';
import { TrendingUp } from 'lucide-react';

const TotalProductStocksCard = () => {
  const { data: products, loading: loadingProducts } = useFetchData<ProductInteface[]>('/products');

  return (
    <Card className="border-2 border-[#1b4c2e]/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#1b4c2e] to-[#2d6b47] text-white pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          Total Stocks / Products
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
        <div className="w-full overflow-x-auto max-h-96">
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b-2 border-[#1b4c2e]/30">
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Product Name
                </th>
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Category
                </th>
                <th className="text-left p-2 sm:p-4 font-bold text-[#1b4c2e] text-xs sm:text-base">
                  Total Stocks
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Example row (replace with dynamic data later) */}
              {products?.map((product) => (
                <tr className="border-b border-gray-200 hover:bg-[#1b4c2e]/5 transition-colors duration-200">
                  <td className="p-2 sm:p-4 text-gray-800 font-semibold text-xs sm:text-sm">
                    {product.name}
                  </td>
                  <td className="p-2 sm:p-4 text-gray-700 text-xs sm:text-sm">
                    {product.category}
                  </td>
                  <td className="p-2 sm:p-4 text-gray-800 font-semibold text-xs sm:text-sm">
                    {product.stocks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="block sm:hidden text-xs text-gray-400 mt-2 sm:mt-3 text-center">
            Swipe left/right to see more columns
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalProductStocksCard;
