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
import { MapPin, Phone, User, FileText, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

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

export default function App() {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white py-3 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-700">
            <Link to="/" className="hover:underline hover:text-[#0c2716]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#0c2716] font-medium">EcoCycle</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900">EcoCycle</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4 font-normal">
            Calculate how much valuable product you can get from your recyclable
            waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16 md:mb-20">
          {/* Input Panel */}
          <Card className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-green-300 transition-colors">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-700" />
                </div>
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm mb-2.5 font-medium text-gray-700">
                  Select Recyclable Type:
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white h-11 px-4 w-full text-sm border-2 border-gray-200 rounded-lg shadow-sm hover:border-green-400 transition-colors">
                    <SelectValue placeholder="Choose recyclable type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-2.5 font-medium text-gray-700">
                  Enter weight (e.g., 2.5 kg):
                </label>
                <Input
                  type="number"
                  placeholder="2 KG"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white h-11 px-4 w-full text-sm border-2 border-gray-200 rounded-lg shadow-sm hover:border-green-400 transition-colors"
                />
              </div>

              <Button
                onClick={handleConvert}
                className="w-full h-11 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md mt-2"
              >
                Convert
              </Button>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-green-300 transition-colors">
            <CardHeader className="pb-5">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-700" />
                </div>
                Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-center text-sm mb-5 font-medium text-gray-600">
                  Conversion Result:
                </p>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 rounded-lg gap-1 sm:gap-0 border-2 border-gray-200">
                    <span className="text-gray-700 text-sm font-medium">Input:</span>
                    <span className="text-gray-700 text-sm font-medium break-words">
                      {weight
                        ? `${weight} kg ${
                            wasteTypes.find((t) => t.value === selectedType)
                              ?.label || ''
                          }`
                        : '-'}
                    </span>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-lg flex flex-col items-center border-2 border-gray-200">
                    <span className="text-gray-700 text-sm font-medium mb-4 px-2">Output:</span>
                    {result ? (
                      <div className="mb-4 flex-shrink-0" style={{ width: '240px', height: '220px', minWidth: '240px', minHeight: '220px', maxWidth: '240px', maxHeight: '220px' }}>
                        <ImageWithFallback
                          src={result.image}
                          alt={result.output}
                          className="rounded-lg shadow-sm"
                          style={{ width: '240px', height: '220px', objectFit: 'cover', display: 'block' }}
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex items-center justify-center bg-gray-100 rounded-lg" style={{ width: '240px', height: '220px' }}>
                        <span className="text-gray-400 text-sm">-</span>
                      </div>
                    )}
                    <span className="text-gray-700 text-sm font-medium text-center px-3">
                      {result
                        ? `${(parseFloat(weight) * 0.2).toFixed(
                            1
                          )} kg ${result.output}`
                        : '-'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg gap-1 sm:gap-0 bg-gray-50 border-2 border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Estimated Value:</span>
                    <span className="text-sm font-medium text-gray-700">
                      {result
                        ? `${result.points} ${
                            result.points === 1 ? 'point' : 'points'
                          }`
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center pt-4 border-t-2 border-gray-200">
                  <p className="text-gray-600 text-xs mb-2 font-semibold tracking-wide">TOTAL:</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {result
                      ? `${result.points} ${
                          result.points === 1 ? 'point' : 'points'
                        }`
                      : '0 points'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Check Your Points */}
        <div className="max-w-lg mx-auto py-12 md:py-16 px-4">
          <div className="rounded-xl shadow-md p-8 w-full bg-white border-2 border-gray-200">
            <h3 className="mb-6 text-xl font-bold text-center text-gray-900">
              Check Your Record Points Here
            </h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm mb-2.5 font-medium text-gray-700" htmlFor="record-id">
                  Record ID
                </label>
                <Input
                  id="record-id"
                  type="text"
                  placeholder="BT-"
                  className="bg-white h-11 px-4 rounded-lg border-2 border-gray-200 shadow-sm w-full text-sm text-gray-900 hover:border-green-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm mb-2.5 font-medium text-gray-700" htmlFor="last-name">
                  Last Name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Enter your last name"
                  className="bg-white h-11 px-4 rounded-lg border-2 border-gray-200 shadow-sm w-full text-sm text-gray-900 hover:border-green-400 transition-colors"
                />
              </div>
              <Button
                className="text-white h-11 px-6 rounded-lg shadow-md w-full transition-all text-sm font-semibold mt-2 bg-green-600 hover:bg-green-700"
                onClick={() => alert('Check Record feature coming soon!')}
              >
                Check Record
              </Button>
            </div>
          </div>
        </div>

        {/* TaliPanahATIN Program */}
        <Card className="shadow-md mt-12 sm:mt-16 md:mt-20 bg-white border-2 border-gray-200 rounded-xl">
          <CardHeader className="text-center rounded-t-xl p-8 sm:p-10 bg-gradient-to-r from-green-600 to-green-700">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              "May Buhay sa Basura ng Barangay"
              <br />
              <span className="text-lg sm:text-xl opacity-90">TaliPaPaNatin</span>
            </CardTitle>
            <p className="mt-3 sm:mt-4 opacity-90 text-sm sm:text-base text-green-100">
              Community Waste Management Programs
            </p>
          </CardHeader>
          <CardContent className="p-8 sm:p-10 md:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programCategories.map((category, index) => (
                <div
                  key={index}
                  className="rounded-lg p-6 bg-gray-50 border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-green-300 transition-all duration-200"
                >
                  <div className="flex items-center mb-5">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-semibold leading-tight text-gray-900">
                      {category.title}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-xs sm:text-sm text-gray-700 flex items-start"
                      >
                        <span className="mr-2 mt-0.5 text-xs flex-shrink-0 text-green-600">
                          •
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
