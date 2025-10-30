import { Input } from '@/components/ui';
import { Search, Sprout } from 'lucide-react';

const FarmInventoryHeader = () => {
  return (
    <header className='grid gap-5'>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 lg:gap-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl sm:rounded-3xl shadow-xl shadow-green-600/30">
            <Sprout className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 tracking-tight">
              Farm Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage agricultural products for farm operations
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group flex-1 lg:max-w-md xl:max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
        </div>
        <Input
          placeholder="Search farm inventory..."
          // value={search}
          // onChange={(e) => setSearch(e.target.value)}
          className="pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 lg:py-3 h-auto text-sm sm:text-base border-2 border-gray-200 focus:border-green-500 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 bg-white"
        />
      </div>
    </header>
  );
};

export default FarmInventoryHeader;
