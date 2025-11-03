import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { sanitizeName, validateName } from '@/utils/validation';
import {
  FileText,
  CheckCircle,
  Home,
  ChevronRight,
  ChevronDown,
  Recycle,
  Trash2,
  Scale,
  RotateCcw,
  Inbox,
  Package,
  Leaf,
  Box,
  Layers,
  Shirt,
  BookOpen,
  Award,
  Target,
  TrendingUp,
  Star,
  Gift,
  Users,
  Globe,
  Heart,
} from 'lucide-react';
import { useLoadingState } from '@/hooks/useLoadingState';
import { TradingPageSkeleton } from '@/components/LoadingSkeletons';
import ResponsiveSkeleton from '@/components/ResponsiveSkeleton';
import useFetchData from '@/admin/hooks/useFetchData';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';

const programCategories = [
  {
    title: 'CIRCULAR ECONOMY',
    items: [
      'ROTTING MIX / SOIL CONDITIONER',
      'FERTILIZER',
      'VERMITECH / LIQUID CONDITIONER',
    ],
  },
  {
    title: 'RECYCLABLE TRADING ACTIVITY',
    items: [
      'SINGLE - USE SOFT AND HARD PLASTICS',
      'CANDY AND CHOCOLATE WRAPPERS',
      'PLASTIC BAGS, FOOD WRAPPING',
      'FOOD TAKEAWAY CONTAINERS',
      'USED CLOTHES / RAGS',
      'BOTTLES, JARS, CHIPS, FIBERGLASS',
      'USED COTTON CLOTHES',
    ],
  },
  {
    title: 'TRASH TO CASHBACK',
    items: [
      'GENERAL SOLID WASTE MATERIALS',
      'TRASH TO SCHOOL SUPPLIES',
      'OFFICE SUPPLIES AND MATERIALS',
    ],
  },
  {
    title: 'TRASH TO BOOKS',
    items: ['EDUCATIONAL MATERIALS', 'READING MATERIALS FOR COMMUNITY'],
  },
  {
    title: 'TRASH TO MEDICINES',
    items: [
      'HERBAL MEDICINE',
      'FIRST AID SUPPLIES',
      'MEDICAL EQUIPMENT FOR COMMUNITY',
    ],
  },
  {
    title: 'ECO BRICK MAKING',
    items: [
      'BASIC URBAN FARMING TUTORIAL',
      'BASIC SEWING TUTORIAL AND LIVELIHOOD',
      'ECO BRICK MAKING',
      'FIESTA TRAINING',
    ],
  },
  {
    title: 'COMMUNITY PANTRY / SOUP KITCHEN',
    items: ['FOOD DISTRIBUTION', 'COMMUNITY MEALS', 'NUTRITION PROGRAMS'],
  },
];

interface ProgramItem {
  _id: string;
  title: string;
  items: ItemInt[];
  category?: string;
  createdAt?: string;
}

interface ItemInt {
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

type ImageData = {
  key: string;
  mimetype: string;
  originalName: string;
  size: number;
  url?: string;
};

interface Record {
  _id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  age: string;
  address: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  _id: string;
  name: string;
  image?: ImageData;
  category?: string;
  subCategory?: string;
  description?: string;
  stocks?: number;
  requiredPoints?: number;
}

interface Material {
  _id: string;
  name: string;
  image?: ImageData;
  description?: string;
  pointsPerKg?: number;
}

export default function Trading() {
  const { isLoading } = useLoadingState(1000);
  const authFetch = useAuthFetch();
  const {
    data: productsData,
    loading: productsDataLoading,
    error: productsDataErr,
    refetch: refetchProduct,
  } = useFetchData<Product[]>('/products');

  const {
    data: programsData,
    loading: programLoading,
    error: programError,
    refetch: refetchPrograms,
  } = useFetchData<ProgramItem[]>('/talipapanatin');

  const programs: ProgramItem[] = useMemo(() => {
    if (programsData && !programLoading && !programError) {
      return programsData;
    } else {
      return [];
    }
  }, [programsData, programLoading, programError]);

  const {
    data: materialsData,
    loading: materialsDataLoading,
    error: materialsDataErr,
    refetch: refetchMaterials,
  } = useFetchData<Material[]>('/materials');

  const materials: Material[] = useMemo(() => {
    if (materialsData && !materialsDataLoading && !materialsDataErr) {
      return materialsData;
    } else {
      return [];
    }
  }, [materialsData, materialsDataLoading, materialsDataErr]);

  const products: Product[] = useMemo(() => {
    if (productsData && !productsDataLoading && !productsDataErr) {
      return productsData;
    } else {
      return [];
    }
  }, [productsData, productsDataLoading, productsDataErr]);

  const [selectedType, setSelectedType] = useState('');
  const [weight, setWeight] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<{
    points: number;
    options?: Product[];
  } | null>(null);

  // Modal state for "Check My Record"
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordId, setRecordId] = useState('');
  const [lastName, setLastName] = useState('');
  const [recordData, setRecordData] = useState<Record | undefined>();

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    lastName || (recordId ? `BT-${recordId}` : 'User')
  )}&background=2f855a&color=fff&size=256`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowRecordModal(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const { success, error: showError } = useToast();

  const handleConvert = () => {
    const numericWeight = parseFloat(weight);
    if (numericWeight > 599) {
      const { error } = useToast();
      error('Maximum weight allowed is 599 kg', { title: 'Validation' });
      return;
    }

    if (selectedType && weight) {
      const material = materials.find((mat) => mat._id === selectedType);
      if (material) {
        const points = parseFloat(weight) * material.pointsPerKg;
        const options = products.filter(
          (prod) => prod.requiredPoints <= points
        );
        setResult({
          points,
          options: options || [],
        });
      }

      // Show success toast (title + message)
      success('You can redeem items based on your points.', {
        title: 'Conversion successful!',
      });
    } else {
      const { error } = useToast();
      error('Please select a recyclable type and enter weight!', {
        title: 'Validation',
      });
    }
  };

  // toast via useToast
  const showRecord = async () => {
    // validate last name before API call
    const { valid: lastValid, message: lastMsg } = validateName(lastName, true);
    if (!lastValid) {
      showError(lastMsg || 'Invalid last name');
      return;
    }
    try {
      const fullId = `BT-${recordId}`;
      const record = await authFetch(`/records/${fullId}?lastName=${lastName}`);

      setRecordData(record);
      setShowRecordModal(true);
      success('Your points have been successfully retrieved.', {
        title: 'Record found!',
      });
    } catch (error: any) {
      showError(
        error?.message || 'Please double-check your Record ID and Last Name.',
        {
          title: 'Record not found',
        }
      );
    }
  };

  if (isLoading) {
    return <ResponsiveSkeleton page="trading" />;
  }

  const selectedWasteType = materials.find((type) => type._id === selectedType);

  const getExpandedDescription = (material?: Material) => {
    if (!material) return '';
    const name = material.name.toLowerCase();
    // handle 'paper' and common misspelling 'papere'
    if (name.includes('paper') || name.includes('papere')) {
      return (
        (material.description || '') +
        ' includes clean paper, cardboard, newspapers, magazines, and mixed paper products. Ensure paper is dry and free from food contamination. Flatten boxes to save space. Paper collected contributes to recycling programs and can be converted into new paper products.'
      );
    }

    return material.description || '';
  };

  return (
    <div className="min-h-screen bg-gradient-professional gradient-mesh relative">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <nav className="flex items-center gap-2 text-xs sm:text-sm">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-2 text-green-100 hover:text-white transition-all duration-300 group"
            >
              <Home className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-semibold">Home</span>
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
            <div className="flex items-center gap-1 sm:gap-2 text-white font-bold">
              <Recycle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>EcoCycle Trading</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
          <div className="inline-block mb-2 sm:mb-4">
            <Recycle
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-green-600 mx-auto animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>

          <h1 className="mb-2 sm:mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-600 to-green-700 leading-normal">
            EcoCycle
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 px-4 font-medium max-w-4xl mx-auto leading-normal mb-6 sm:mb-8">
            Transform your waste into{' '}
            <span className="text-green-600 font-bold">valuable resources</span>{' '}
            and earn <span className="text-green-600 font-bold">rewards</span>{' '}
            while saving our planet
          </p>

          {/* Feature Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {[
              { icon: Leaf, text: 'Eco-Friendly' },
              { icon: Star, text: 'Earn Points' },
              { icon: Globe, text: 'Save Earth' },
              { icon: TrendingUp, text: 'Track Progress' },
            ].map((badge, index) => (
              <div
                key={index}
                className="group px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <badge.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{badge.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-7xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          {/* Input Panel */}
          <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-br from-green-600 to-green-600 text-white rounded-t-2xl sm:rounded-t-3xl">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="block">Input Your Waste</span>
                  <span className="text-xs sm:text-sm font-normal text-green-100 block mt-1">
                    Select type and enter weight
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
              {/* Waste Type Selection - converted to dropdown */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Select Recyclable Type:
                </label>

                <div>
                  {/* Custom dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    {/* Button */}
                    <div
                      tabIndex={0}
                      role="button"
                      aria-haspopup="listbox"
                      aria-expanded={dropdownOpen}
                      onClick={() => setDropdownOpen((s) => !s)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setDropdownOpen((s) => !s);
                        }
                      }}
                      className="w-full h-12 pl-4 pr-10 relative flex items-center justify-between text-base border-2 border-gray-300 rounded-xl hover:border-green-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white cursor-pointer"
                    >
                      <div className="truncate pr-10">
                        {selectedWasteType ? (
                          <div className="font-medium text-gray-900">
                            {selectedWasteType.name}
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            -- Select recyclable type --
                          </div>
                        )}
                      </div>
                      <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <ChevronDown
                          className={`w-4 h-4 transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Dropdown list (designable) - shows only when open */}
                    {dropdownOpen && (
                      <div className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg p-3 max-h-72 overflow-auto">
                        <div className="grid grid-cols-1 gap-2 sm:gap-3">
                          {materials.map((material) => (
                            <button
                              type="button"
                              key={material._id}
                              onClick={() => {
                                setSelectedType(material._id);
                                setDropdownOpen(false);
                              }}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between h-12 sm:h-12 active:scale-95
        ${
          selectedType === material._id
            ? 'border-green-500 bg-green-50 shadow-md'
            : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
        }`}
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="pr-3 truncate text-left">
                                  <div className="font-medium text-gray-900">
                                    {material.name}
                                  </div>
                                </div>
                                <div className="w-6 flex items-center justify-center flex-shrink-0">
                                  {selectedType === material._id ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <span className="w-5 h-5 block" />
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Show description for selected type - styled container */}
                  <div className="mt-4">
                    {selectedWasteType ? (
                      <div className="flex items-start gap-4 bg-gradient-to-r from-white to-green-50 border border-gray-200 rounded-xl p-4 shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                          <Recycle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-sm font-bold text-gray-900">
                                {selectedWasteType.name}
                              </div>
                              <div className="mt-1 text-sm text-gray-600 leading-relaxed">
                                {getExpandedDescription(selectedWasteType)}
                              </div>
                            </div>
                            {selectedWasteType.pointsPerKg != null && (
                              <div className="ml-4 flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        Select a recyclable type to see its description.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-3 sm:space-y-4">
                <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Enter Weight (kg):
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 2.5"
                    value={weight}
                    min={0}
                    max={599}
                    onKeyDown={(e) => {
                      // Allow navigation/editing keys
                      const allowedKeys = [
                        'Backspace',
                        'Tab',
                        'ArrowLeft',
                        'ArrowRight',
                        'Delete',
                        'Home',
                        'End',
                      ];
                      if (allowedKeys.includes(e.key)) return;

                      // Allow ctrl/cmd shortcuts
                      if (e.ctrlKey || e.metaKey) return;

                      // Allow digits and dot
                      if (/^[0-9.]$/.test(e.key)) return;

                      // Prevent anything else (letters, symbols)
                      e.preventDefault();
                      showError(
                        'Only numeric characters and a single decimal point are allowed',
                        { title: 'Validation' }
                      );
                    }}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                      const pasted = e.clipboardData.getData('text');
                      const sanitized = pasted.replace(/[^0-9.]/g, '');
                      if (sanitized !== pasted) {
                        e.preventDefault();
                        showError(
                          'Pasted content contains invalid characters. Only numbers and a decimal point are allowed.',
                          { title: 'Validation' }
                        );
                      }
                    }}
                    onChange={(e) => {
                      const raw = e.target.value || '';

                      // Keep only digits and decimal point
                      const sanitized = raw.replace(/[^0-9.]/g, '');

                      // Allow only a single decimal point
                      const parts = sanitized.split('.');
                      const normalized =
                        parts.length > 1
                          ? parts[0] + '.' + parts.slice(1).join('')
                          : sanitized;

                      // If characters were removed, show a validation toast
                      if (sanitized !== raw) {
                        showError(
                          'Only numeric characters and a single decimal point are allowed',
                          { title: 'Validation' }
                        );
                      }

                      if (!normalized) {
                        setWeight('');
                        return;
                      }

                      const num = parseFloat(normalized);
                      if (!isNaN(num)) {
                        if (num > 599) {
                          setWeight('599');
                          showError('Maximum weight allowed is 599 kg', {
                            title: 'Validation',
                          });
                        } else if (num < 0) {
                          setWeight('0');
                          showError('Minimum weight is 0 kg', {
                            title: 'Validation',
                          });
                        } else {
                          // preserve user-typed normalized string (so decimals are kept)
                          setWeight(normalized);
                        }
                      } else {
                        setWeight('');
                      }
                    }}
                    className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base border-2 border-gray-300 rounded-lg sm:rounded-xl hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all no-spinner"
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium text-sm">
                    kg
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={!selectedType || !weight}
                className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 active:scale-95"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Convert to Value
              </Button>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-br from-green-600 to-green-600 text-white rounded-t-2xl sm:rounded-t-3xl">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <span className="block">Conversion Results</span>
                  <span className="text-xs sm:text-sm font-normal text-green-100 block mt-1">
                    Your environmental impact
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
              {/* Input Summary */}
              <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Inbox className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">
                    Input Summary
                  </span>
                </div>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 text-right">
                      {selectedWasteType?.name || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900">
                      {weight ? `${weight} kg` : 'Not entered'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Output Products */}
              <div className="p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  <span className="font-bold text-gray-800 text-xs sm:text-sm">
                    Possible Redeemable Items
                  </span>
                </div>

                {result && result.options && result.options.length > 0 ? (
                  <div className="space-y-1 sm:space-y-2">
                    {result.options.map((opt, i) => {
                      const key = opt.name.toLowerCase();
                      let Icon = Box;

                      if (
                        key.includes('compost') ||
                        key.includes('soil') ||
                        key.includes('mulch')
                      ) {
                        Icon = Leaf;
                      } else if (key.includes('fertilizer')) {
                        Icon = Layers;
                      } else if (
                        key.includes('rags') ||
                        key.includes('clothes')
                      ) {
                        Icon = Shirt;
                      } else if (key.includes('books')) {
                        Icon = BookOpen;
                      }

                      return (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-white border border-green-200 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2"
                        >
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-800 leading-normal">
                            {opt.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-xs sm:text-sm text-gray-500">
                      Convert your waste to see possible outputs
                    </div>
                  </div>
                )}
              </div>

              {/* Points Display */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-50 rounded-lg sm:rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">
                      TOTAL POINTS EARNED
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-600">
                    {result ? result.points : 0}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-gray-600 mt-1">
                    {result && result.points === 1 ? 'POINT' : 'POINTS'}
                  </div>

                  {result && (
                    <div className="mt-2 sm:mt-3 text-xs font-medium text-green-700">
                      Great work! Keep recycling for a better planet.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check Your Points Section */}
        <div className="max-w-2xl mx-auto py-8 sm:py-12 lg:py-16 px-4">
          <Card className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 text-green-600" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Check Your Record Points
                </h3>
                <p className="text-sm sm:text-base text-gray-600 font-medium">
                  Enter your details to view your recycling achievements
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Record ID
                  </label>

                  {/* Input group with fixed BT- prefix */}
                  <div className="relative">
                    <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold text-sm">
                      BT-
                    </span>
                    <Input
                      type="text"
                      value={recordId}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                        const pasted = e.clipboardData.getData('text');
                        const sanitized = pasted.replace(/\D/g, '');
                        if (sanitized !== pasted) {
                          e.preventDefault();
                          showError(
                            'Pasted content contains invalid characters. Record ID accepts digits only.',
                            { title: 'Validation' }
                          );
                        }
                      }}
                      onChange={(e) => {
                        // Allow digits only and limit to 4 digits
                        const raw = e.target.value || '';
                        const digitsOnly = raw.replace(/\D/g, '');
                        if (digitsOnly !== raw) {
                          showError('Record ID accepts digits only', {
                            title: 'Validation',
                          });
                        }
                        const limited = digitsOnly.slice(0, 4);
                        setRecordId(limited);
                      }}
                      placeholder="0001"
                      className="h-10 sm:h-12 pl-12 sm:pl-14 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-300 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      const raw = e.target.value || '';
                      const sanitized = sanitizeName(raw);
                      if (sanitized !== raw) {
                        showError(
                          'Only letters, spaces, apostrophes and hyphens are allowed in names',
                          { title: 'Validation' }
                        );
                      }
                      setLastName(sanitized);
                    }}
                    onPaste={(e: React.ClipboardEvent<HTMLInputElement>) => {
                      const pasted = e.clipboardData.getData('text');
                      const sanitized = sanitizeName(pasted);
                      if (sanitized !== pasted) {
                        e.preventDefault();
                        showError(
                          'Pasted content contains invalid characters. Only letters, spaces, apostrophes and hyphens are allowed.',
                          { title: 'Validation' }
                        );
                      }
                    }}
                    onBlur={() => {
                      const { valid, message } = validateName(lastName, true);
                      if (!valid) showError(message || 'Invalid last name');
                    }}
                    placeholder="Enter your last name"
                    className="h-10 sm:h-12 px-3 sm:px-4 rounded-lg sm:rounded-xl border-2 border-gray-300 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all text-sm sm:text-base"
                  />
                </div>

                {/* toasts replace inline messages */}
                <Button
                  onClick={showRecord}
                  type="button"
                  disabled={!recordId || !lastName}
                  className="w-full h-10 sm:h-12 font-bold bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 active:scale-95 text-sm sm:text-base"
                >
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Check My Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TaliPanahATIN Program */}
        <Card className="shadow-xl mt-12 sm:mt-16 lg:mt-20 bg-white rounded-2xl sm:rounded-3xl border border-gray-200 overflow-hidden">
          <CardHeader className="text-center p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-green-700 to-green-800 text-white">
            <Leaf className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-3 sm:mb-4 text-green-200" />
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
              "May Buhay sa Basura ng Barangay"
            </CardTitle>
            <div className="text-lg sm:text-xl font-bold text-green-100 mb-2 sm:mb-3">
              TaliPaPaNatin Program
            </div>
            <p className="text-sm sm:text-base text-green-100 font-medium max-w-2xl mx-auto">
              Transforming communities through innovative waste management and
              sustainability programs
            </p>
          </CardHeader>

          <CardContent className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-green-50/30">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Our Impact Programs
              </h3>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Creating sustainable communities through waste-to-value
                initiatives
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {programs.length > 0 &&
                programs.map((category, index) => (
                  <div
                    key={index}
                    className="rounded-xl sm:rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-green-600 to-green-600 p-3 sm:p-4 text-white">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-white/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold leading-tight">
                          {category.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <ul className="space-y-1 sm:space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start bg-green-50 p-2 rounded-md sm:rounded-lg border border-green-100"
                          >
                            <span className="w-5 sm:w-6 flex items-start justify-center mt-0.5 sm:mt-1 mr-2">
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" />
                            </span>
                            <span className="text-xs font-medium text-gray-700 leading-normal">
                              {item.name}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Record Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRecordModal(false)}
          />
          <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden">
            <div className="p-4 sm:p-6 bg-gradient-to-r from-green-600 to-green-600 text-white">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl overflow-hidden bg-white/20">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    {recordData?.firstName || 'User'}{' '}
                    {recordData?.lastName || ''}
                  </h3>
                  <p className="text-green-100 text-xs sm:text-sm">
                    ID: {recordData?._id || recordId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 text-center">
              <div className="mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                  {recordData?.points || 0}
                </div>
                <div className="text-xs sm:text-sm font-medium text-gray-600">
                  TOTAL POINTS
                </div>
              </div>

              <div className="flex">
                <Button
                  onClick={() => setShowRecordModal(false)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 h-10 sm:h-12 text-sm sm:text-base active:scale-95"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
