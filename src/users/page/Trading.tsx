import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { useLoadingState } from '@/hooks/useLoadingState';
import { TradingPageSkeleton } from '@/components/LoadingSkeletons';

const wasteTypes = [
  {
    value: 'plastic-bottles',
    label: 'Plastic Bottles',
    rate: 1,
    output: 'Good Soil',
    image:
      'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBzb2lsJTIwY29tcG9zdHxlbnwxfHx8fDE3NTk1NjAyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'paper-cardboard',
    label: 'Paper & Cardboard',
    rate: 1,
    output: 'Fertilizer',
    image:
      'https://images.unsplash.com/photo-1539902879984-7a1fa3844e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmVydGlsaXplciUyMHNvaWwlMjBjb25kaXRpb25lcnxlbnwxfHx8fDE3NTk1NjAyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'organic-waste',
    label: 'Organic Waste',
    rate: 1,
    output: 'Compost',
    image:
      'https://images.unsplash.com/photo-1708432331128-cfe5a2803781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0JTIwb3JnYW5pYyUyMHdhc3RlJTIwZmVydGlsaXplcnxlbnwxfHx8fDE3NTk1NjAyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'cans-metal',
    label: 'Cans & Metal',
    rate: 1,
    output: 'Vermitech/Liquid Conditioner',
    image:
      'https://images.unsplash.com/photo-1678129456841-47b1aca89e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJtaWNvbXBvc3QlMjBsaXF1aWQlMjBmZXJ0aWxpemVyJTIwdGVhfGVufDF8fHx8MTc1OTU2MDIyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

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

export default function Trading() {
  // Add loading state with 1 second display
  const { isLoading } = useLoadingState(1000);

  const [selectedType, setSelectedType] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{
    points: number;
    output: string;
    image: string;
  } | null>(null);

  const handleConvert = () => {
    console.log(
      'Button clicked! selectedType:',
      selectedType,
      'weight:',
      weight
    );
    if (selectedType && weight) {
      const wasteType = wasteTypes.find((type) => type.value === selectedType);
      if (wasteType) {
        const points = parseFloat(weight) * wasteType.rate;
        setResult({
          points,
          output: wasteType.output,
          image: wasteType.image,
        });
      }
    } else {
      alert('Please select a recyclable type and enter weight!');
    }
  };

  // Show loading skeleton while loading
  if (isLoading) {
    return <TradingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Breadcrumb - Seamless with Navbar */}
      <div className="bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-t border-green-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-green-100 hover:text-white transition-colors group"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-green-400" />
            <div className="flex items-center gap-1.5 text-white font-semibold">
              <Recycle className="w-4 h-4" />
              <span>EcoCycle Trading</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <span className="text-6xl sm:text-7xl">♻️</span>
          </div>
          <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">
            EcoCycle
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 font-medium max-w-3xl mx-auto leading-relaxed">
            Calculate how much valuable product you can get from your recyclable
            waste
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-green-700 font-semibold">
            <span className="px-4 py-2 bg-green-100 rounded-full border border-green-200">
              🌱 Eco-Friendly
            </span>
            <span className="px-4 py-2 bg-green-100 rounded-full border border-green-200">
              💰 Earn Points
            </span>
            <span className="px-4 py-2 bg-green-100 rounded-full border border-green-200">
              🌍 Save Earth
            </span>
          </div>
        </div>

        {/* Enhanced Calculator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
          {/* Enhanced Input Panel */}
          <Card className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-5 bg-gradient-to-br from-green-50 to-white border-b-2 border-green-100">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span>Input Waste</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <label className="text-sm mb-3 font-bold text-gray-800 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-green-600" />
                  Select Recyclable Type:
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white h-12 px-4 w-full text-sm border-2 border-gray-300 rounded-xl shadow-sm hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium">
                    <SelectValue placeholder="Choose recyclable type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="font-medium"
                      >
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className=" text-sm mb-3 font-bold text-gray-800 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-green-600" />
                  Enter weight (kg):
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 2.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white h-12 px-4 w-full text-base border-2 border-gray-300 rounded-xl shadow-sm hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                />
              </div>

              <Button
                onClick={handleConvert}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 mt-4"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Convert Now
              </Button>
            </CardContent>
          </Card>

          {/* Enhanced Result Panel */}
          <Card className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-5 bg-gradient-to-br from-green-50 to-white border-b-2 border-green-100">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span>Conversion Result</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-center text-base mb-6 font-bold text-gray-800 flex items-center justify-center gap-2">
                  <span className="text-xl"></span>
                  Your Conversion Summary
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl gap-2 sm:gap-0 border-2 border-gray-200">
                    <span className="text-gray-700 text-sm font-bold flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-green-600" />
                      Input:
                    </span>
                    <span className="text-gray-900 text-sm font-bold break-words">
                      {weight
                        ? `${weight} kg ${
                            wasteTypes.find((t) => t.value === selectedType)
                              ?.label || ''
                          }`
                        : 'Not calculated yet'}
                    </span>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex flex-col items-center border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Package className="w-4 h-4 text-green-600" />
                      <span className="text-gray-800 text-sm font-bold">
                        Output Product:
                      </span>
                    </div>
                    {result ? (
                      <div
                        className="mb-4 flex-shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-white"
                        style={{
                          width: '240px',
                          height: '220px',
                          minWidth: '240px',
                          minHeight: '220px',
                          maxWidth: '240px',
                          maxHeight: '220px',
                        }}
                      >
                        <ImageWithFallback
                          src={result.image}
                          alt={result.output}
                          className=""
                          style={{
                            width: '240px',
                            height: '220px',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className="mb-4 flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-gray-300"
                        style={{ width: '240px', height: '220px' }}
                      >
                        <div className="text-center">
                          <Package className="w-16 h-16 mb-2 mx-auto text-gray-400" />
                          <span className="text-gray-400 text-sm font-medium">
                            Awaiting conversion
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="bg-white px-4 py-2 rounded-lg border-2 border-green-200 shadow-sm">
                      <span className="text-gray-900 text-sm font-bold text-center">
                        {result
                          ? `${(parseFloat(weight) * 0.2).toFixed(1)} kg ${result.output}`
                          : 'No output yet'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center pt-6 border-t-2  bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
                  <p className="text-gray-700 text-sm mb-3 font-bold tracking-wide flex items-center justify-center gap-2">
                    <span className="text-xl"></span>
                    TOTAL POINTS:
                  </p>
                  <p className="text-4xl font-bold text-green-700">
                    {result
                      ? `${result.points} ${result.points === 1 ? 'pt' : 'pts'}`
                      : '0 pts'}
                  </p>
                  {result && (
                    <p className="text-xs text-green-600 mt-2 font-semibold">
                      Great job! Keep recycling! 🌱
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Check Your Points */}
        <div className="max-w-lg mx-auto py-12 md:py-16 px-4">
          <div className="rounded-2xl shadow-xl p-8 w-full bg-white border-2 border-gray-200 hover:border-green-300 transition-all">
            <div className="text-center mb-6">
              <div className="inline-block mb-3">
                <span className="text-5xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Record Points
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Enter your details to view your recycling points
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <label
                  className="text-sm mb-3 font-bold text-gray-800 flex items-center gap-2"
                  htmlFor="record-id"
                >
                  <span className="text-lg"></span>
                  Record ID
                </label>
                <Input
                  id="record-id"
                  type="text"
                  placeholder="BT-0001"
                  className="bg-white h-12 px-4 rounded-xl border-2 border-gray-300 shadow-sm w-full text-base text-gray-900 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                />
              </div>
              <div>
                <label
                  className="text-sm mb-3 font-bold text-gray-800 flex items-center gap-2"
                  htmlFor="last-name"
                >
                  <span className="text-lg"></span>
                  Last Name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Enter your last name"
                  className="bg-white h-12 px-4 rounded-xl border-2 border-gray-300 shadow-sm w-full text-base text-gray-900 hover:border-green-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-medium"
                />
              </div>
              <Button
                className="text-white h-12 px-6 rounded-xl shadow-lg w-full transition-all text-base font-bold mt-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:-translate-y-1"
                onClick={() => alert('Check Record feature coming soon!')}
              >
                <span className="mr-2">🔍</span>
                Check My Record
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced TaliPanahATIN Program */}
        <Card className="shadow-xl mt-12 sm:mt-16 md:mt-20 bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
          <CardHeader className="text-center rounded-t-2xl p-8 sm:p-10 bg-gradient-to-br from-green-600 via-green-700 to-green-800">
            <div className="mb-4">
              <span className="text-6xl">🌱</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-2">
              "May Buhay sa Basura ng Barangay"
            </CardTitle>
            <div className="text-xl sm:text-2xl font-bold text-green-100 mb-3">
              TaliPaPaNatin Program
            </div>
            <p className="text-sm sm:text-base text-green-100 font-medium max-w-2xl mx-auto">
              Community Waste Management & Sustainability Programs
            </p>
          </CardHeader>
          <CardContent className="p-8 sm:p-10 md:p-12 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Our Programs
              </h3>
              <p className="text-gray-600 font-medium">
                Transforming waste into community value
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programCategories.map((category, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-green-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header with Gradient */}
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 border-b-2 border-green-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-md">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-sm font-bold leading-tight text-white">
                        {category.title}
                      </h4>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <ul className="space-y-2.5">
                      {category.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="text-xs sm:text-sm text-gray-700 flex items-start bg-gradient-to-br from-gray-50 to-green-50/30 p-2.5 rounded-lg hover:from-green-50 hover:to-green-100/50 transition-all duration-200 border border-gray-100"
                        >
                          <span className="mr-2 mt-0.5 text-base flex-shrink-0 text-green-600">
                            ✓
                          </span>
                          <span className="leading-relaxed font-medium">
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
    </div>
  );
}
