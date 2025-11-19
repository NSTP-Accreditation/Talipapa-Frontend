import { Input } from '@/components/ui';
import { FarmItemInterface } from '@/types/global.types';
import { debounce, DebouncedFunc } from 'lodash';
import { Search, Sprout, Package, ListTree } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

type FarmInventoryHeaderProps = {
  farmItemsData: FarmItemInterface[];
  setFilteredFarmItems: Dispatch<SetStateAction<FarmItemInterface[]>>;
};

const FarmInventoryHeader = ({
  farmItemsData,
  setFilteredFarmItems,
}: FarmInventoryHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize with null
  const debouncedSearchRef = useRef<DebouncedFunc<
    (query: string) => void
  > | null>(null);

  useEffect(() => {
    // Assign the debounced function
    debouncedSearchRef.current = debounce((query: string) => {
      const normalizedQuery = query.trim().toLowerCase();

      if (!normalizedQuery) {
        setFilteredFarmItems(farmItemsData);
        return;
      }

      const filteredFarmItems = farmItemsData.filter((item) =>
        item.name?.toLowerCase().includes(normalizedQuery)
      );

      setFilteredFarmItems(filteredFarmItems);
    }, 300);

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [farmItemsData, setFilteredFarmItems]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchRef.current?.(value);
  };

  return (
    <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-600 rounded-full -ml-24 -mb-24"></div>
      </div>

      <div className="relative p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
          <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 via-green-600 to-green-700 shadow-lg ring-4 ring-green-100 animate-pulse-slow">
            <Sprout className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Farm Inventory Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium mb-4">
              Manage agricultural products for farm operations
            </p>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs sm:text-sm font-semibold text-green-700">
                <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Farm Products</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs sm:text-sm font-semibold text-blue-700">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Stock Management</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs sm:text-sm font-semibold text-purple-700">
                <ListTree className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Item Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search farm inventory..."
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default FarmInventoryHeader;
