import { Input } from '@/components/ui';
import { MaterialInterface, ProductInterface } from '@/types/global.types';
import { debounce, DebouncedFunc } from 'lodash';
import { Package, Search, X } from 'lucide-react';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

type InventoryHeaderProps = {
  productsData: ProductInterface[];
  materialsData: MaterialInterface[];
  setFilteredProducts: Dispatch<SetStateAction<ProductInterface[]>>;
  setFilteredMaterials: Dispatch<SetStateAction<MaterialInterface[]>>;
};

const InventoryHeader = ({
  productsData = [],
  materialsData = [],
  setFilteredProducts,
  setFilteredMaterials,
}: InventoryHeaderProps) => {
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
        setFilteredProducts(productsData);
        setFilteredMaterials(materialsData);
        return;
      }

      const filteredProducts = productsData.filter((product) =>
        product.name?.toLowerCase().includes(normalizedQuery)
      );

      const filteredMaterials = materialsData.filter((material) =>
        material.name?.toLowerCase().includes(normalizedQuery)
      );

      setFilteredProducts(filteredProducts);
      setFilteredMaterials(filteredMaterials);
    }, 300);

    return () => {
      debouncedSearchRef.current?.cancel();
    };
  }, [productsData, materialsData, setFilteredProducts, setFilteredMaterials]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearchRef.current?.(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(productsData);
    setFilteredMaterials(materialsData);
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
            <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Manage products and materials for trading operations
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={handleInputChange}
            className="pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-sm sm:text-base bg-white"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;
