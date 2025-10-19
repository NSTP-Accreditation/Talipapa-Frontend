import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  CheckCircle,
  Home,
  ChevronRight,
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
  subCategory?: string,
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
  const { data: productsData, loading: productsDataLoading, error: productsDataErr, refetch: refetchProduct } = useFetchData<Product[]>("/products");
  
  const { data: materialsData, loading: materialsDataLoading, error: materialsDataErr, refetch: refetchMaterials } = useFetchData<Material[]>("/materials");
  
  const materials: Material[] = useMemo(() => {
    if(materialsData && !materialsDataLoading && !materialsDataErr) {
      return materialsData;
    } else {
      return [];
    }
  }, [materialsData, materialsDataLoading, materialsDataErr])

  const products: Product[] = useMemo(() => {
    if(productsData && !productsDataLoading && !productsDataErr) {
      return productsData;
    } else {
      return [];
    }
  }, [productsData, productsDataLoading, productsDataErr])

  const [selectedType, setSelectedType] = useState('');
  const [weight, setWeight] = useState('');
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
    lastName || recordId || 'User'
  )}&background=2f855a&color=fff&size=256`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowRecordModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleConvert = () => {
    if (selectedType && weight) {
      const material = materials.find(mat => mat._id === selectedType);
      if(material) {
        const points = parseFloat(weight) * material.pointsPerKg;
        const options = products.filter(prod => prod.requiredPoints <= points);
        setResult({
          points,
          options: options || [],
        });
      }

    } else {
      alert('Please select a recyclable type and enter weight!');
    }
  };

  const showRecord = async () => {
    try {
      const record = await authFetch(
        `/records/${recordId}?lastName=${lastName}`
      );

      setRecordData(record);
      setShowRecordModal(true);
    } catch (error) {
      // Log the actual error to the console for easier debugging
      console.error('showRecord error:', error);
      alert('Record Not Found');
    }
  };

  if (isLoading) {
    return <TradingPageSkeleton />;
  }

  const selectedWasteType = materials.find(
    (type) => type._id === selectedType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/20">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center gap-2 text-green-100 hover:text-white transition-all duration-300 group"
            >
              <Home className="w-4 h-4" />
              <span className="font-semibold">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-green-400" />
            <div className="flex items-center gap-2 text-white font-bold">
              <Recycle className="w-4 h-4" />
              <span>EcoCycle Trading</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="inline-block mb-6">
            <Recycle
              className="w-20 h-20 text-green-600 mx-auto animate-spin"
              style={{ animationDuration: '3s' }}
            />
          </div>

          <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-600 to-green-700">
            EcoCycle
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 px-4 font-medium max-w-4xl mx-auto leading-relaxed mb-8">
            Transform your waste into{' '}
            <span className="text-green-600 font-bold">valuable resources</span>{' '}
            and earn <span className="text-green-600 font-bold">rewards</span>{' '}
            while saving our planet
          </p>

          {/* Feature Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: Leaf, text: 'Eco-Friendly' },
              { icon: Star, text: 'Earn Points' },
              { icon: Globe, text: 'Save Earth' },
              { icon: TrendingUp, text: 'Track Progress' },
            ].map((badge, index) => (
              <div
                key={index}
                className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <badge.icon className="w-4 h-4" />
                  <span>{badge.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-20">
          {/* Input Panel */}
          <Card className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6 bg-gradient-to-br from-green-600 to-green-600 text-white rounded-t-3xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="block">Input Your Waste</span>
                  <span className="text-sm font-normal text-green-100 block mt-1">
                    Select type and enter weight
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 p-8">
              {/* Waste Type Selection */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-green-600" />
                  Select Recyclable Type:
                </label>

                <div className="grid grid-cols-1 gap-3">
                  {materials.map((material) => (
                    <div
                      key={material._id}
                      onClick={() => setSelectedType(material._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        selectedType === material._id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">
                            {material.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {material.description}
                          </div>
                        </div>
                        {selectedType === material._id && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weight Input */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-green-600" />
                  Enter Weight (kg):
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="e.g., 2.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-12 px-4 text-base border-2 border-gray-300 rounded-xl hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                    kg
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={!selectedType || !weight}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Convert to Value
              </Button>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-6 bg-gradient-to-br from-green-600 to-green-600 text-white rounded-t-3xl">
              <CardTitle className="text-2xl font-bold flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="block">Conversion Results</span>
                  <span className="text-sm font-normal text-green-100 block mt-1">
                    Your environmental impact
                  </span>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {/* Input Summary */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Inbox className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-gray-800 text-sm">
                    Input Summary
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">
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
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-gray-800 text-sm">
                    Possible Outputs
                  </span>
                </div>

                {result && result.options && result.options.length > 0 ? (
                  <div className="space-y-2">
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
                          className="flex items-center gap-2 bg-white border border-green-200 rounded-lg px-3 py-2"
                        >
                          <Icon className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-800">
                            {opt.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Target className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-sm text-gray-500">
                      Convert your waste to see possible outputs
                    </div>
                  </div>
                )}
              </div>

              {/* Points Display */}
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-50 rounded-xl border border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="font-bold text-gray-800 text-sm">
                      TOTAL POINTS EARNED
                    </span>
                  </div>

                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-600">
                    {result ? result.points : 0}
                  </div>
                  <div className="text-sm font-bold text-gray-600 mt-1">
                    {result && result.points === 1 ? 'POINT' : 'POINTS'}
                  </div>

                  {result && (
                    <div className="mt-3 text-xs font-medium text-green-700">
                      Great work! Keep recycling for a better planet.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check Your Points Section */}
        <div className="max-w-2xl mx-auto py-16 px-4">
          <Card className="bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Check Your Record Points
                </h3>
                <p className="text-gray-600 font-medium">
                  Enter your details to view your recycling achievements
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Record ID
                  </label>
                  <Input
                    type="text"
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="Enter your Record ID (e.g., BT-0001)"
                    className="h-12 px-4 rounded-xl border-2 border-gray-300 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="h-12 px-4 rounded-xl border-2 border-gray-300 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                  />
                </div>

                <Button
                  onClick={showRecord}
                  type="button"
                  disabled={!recordId || !lastName}
                  className="w-full h-12 font-bold bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Check My Record
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TaliPanahATIN Program */}
        <Card className="shadow-xl mt-20 bg-white rounded-3xl border border-gray-200 overflow-hidden">
          <CardHeader className="text-center p-12 bg-gradient-to-br from-green-700 to-green-800 text-white">
            <Leaf className="w-16 h-16 mx-auto mb-4 text-green-200" />
            <CardTitle className="text-3xl font-bold mb-2">
              "May Buhay sa Basura ng Barangay"
            </CardTitle>
            <div className="text-xl font-bold text-green-100 mb-3">
              TaliPaPaNatin Program
            </div>
            <p className="text-green-100 font-medium max-w-2xl mx-auto">
              Transforming communities through innovative waste management and
              sustainability programs
            </p>
          </CardHeader>

          <CardContent className="p-12 bg-gradient-to-br from-gray-50 to-green-50/30">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Our Impact Programs
              </h3>
              <p className="text-gray-600 font-medium">
                Creating sustainable communities through waste-to-value
                initiatives
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programCategories.map((category, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-600 p-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-sm font-bold leading-tight">
                        {category.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-4">
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start bg-green-50 p-2 rounded-lg border border-green-100"
                        >
                          <CheckCircle className="w-3 h-3 text-green-600 mt-1 mr-2 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-700 leading-relaxed">
                            {item}
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
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRecordModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-600 to-green-600 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {recordData?.firstName || 'User'}{' '}
                    {recordData?.lastName || ''}
                  </h3>
                  <p className="text-green-100 text-sm">
                    ID: {recordData?._id || recordId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {recordData?.points || 0}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  TOTAL POINTS
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowRecordModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setShowRecordModal(false)}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
