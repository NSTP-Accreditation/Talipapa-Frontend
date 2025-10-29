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
}

const InventoryHeader = ({ 
  productsData = [], 
  materialsData = [], 
  setFilteredProducts, 
  setFilteredMaterials 
}: InventoryHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize with null
  const debouncedSearchRef = useRef<DebouncedFunc<(query: string) => void> | null>(null);
  
  useEffect(() => {
    // Assign the debounced function
    debouncedSearchRef.current = debounce((query: string) => {
      const normalizedQuery = query.trim().toLowerCase();
      
      if (!normalizedQuery) {
        setFilteredProducts(productsData);
        setFilteredMaterials(materialsData);
        return;
      }
      
      const filteredProducts = productsData.filter(product => 
        product.name?.toLowerCase().includes(normalizedQuery)
      );
      
      const filteredMaterials = materialsData.filter(material => 
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
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
      <div className="flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 rounded-xl sm:rounded-2xl shadow-lg shadow-green-500/20 ring-1 ring-green-200/50">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-700" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Inventory Management
            </h1>
            <p className="text-[11px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Manage products and materials for trading operations
            </p>
          </div>
        </div>
      </div>
      <div className="relative group flex-1 lg:max-w-md xl:max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
        </div>
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={handleInputChange}
          className="pl-10 sm:pl-12 pr-9 sm:pr-10 py-2.5 sm:py-3 w-full border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-[13px] sm:text-base bg-white"
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
    </header>
  );
};

export default InventoryHeader;