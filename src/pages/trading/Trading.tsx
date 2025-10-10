import './index.css';
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
import { MapPin, Phone, User } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>EcoCycle</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold">Eco Cycle</h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Calculate how much valuable product you can get from your recyclable
            waste
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12 md:mb-16">
          {/* Input Panel */}
          <Card style={{ backgroundColor: '#f1f8f4', borderColor: '#c8e6c9' }}>
            <CardHeader>
              <CardTitle
                className="flex items-center text-base sm:text-lg"
                style={{ color: '#1b4c2e' }}
              >
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white flex items-center justify-center text-xs sm:text-sm mr-2"
                  style={{ backgroundColor: '#1b4c2e' }}
                >
                  ♻
                </div>
                Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  className="block text-xs sm:text-sm mb-2"
                  style={{ color: '#1b4c2e' }}
                >
                  Select Recyclable Type:
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger
                    className="bg-white h-9 sm:h-10 px-3 sm:px-4 w-full text-sm"
                    style={{ borderColor: '#a5d6a7' }}
                  >
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
                <label
                  className="block text-xs sm:text-sm mb-2"
                  style={{ color: '#1b4c2e' }}
                >
                  Enter weight (e.g., 2.5 kg):
                </label>
                <Input
                  type="number"
                  placeholder="2 KG"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white h-9 sm:h-10 px-3 sm:px-4 w-full text-sm"
                  style={{ borderColor: '#a5d6a7' }}
                />
              </div>

              <Button
                onClick={handleConvert}
                className="w-full z-10 h-10 sm:h-12 text-sm sm:text-base font-semibold"
                style={{ backgroundColor: '#1b4c2e' }}
              >
                Convert
              </Button>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card style={{ backgroundColor: '#f1f8f4', borderColor: '#c8e6c9' }}>
            <CardHeader>
              <CardTitle
                className="flex items-center text-base sm:text-lg"
                style={{ color: '#1b4c2e' }}
              >
                <div
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full text-white flex items-center justify-center text-xs sm:text-sm mr-2"
                  style={{ backgroundColor: '#1b4c2e' }}
                >
                  📊
                </div>
                Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-center text-sm sm:text-base mb-4" style={{ color: '#1b4c2e' }}>
                  Conversion Result:
                </p>

                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-red-50 rounded gap-1 sm:gap-0">
                    <span className="text-red-600 text-xs sm:text-sm font-medium">Input:</span>
                    <span className="text-red-600 text-xs sm:text-sm break-words">
                      {weight
                        ? `${weight} kg ${
                            wasteTypes.find((t) => t.value === selectedType)
                              ?.label || ''
                          }`
                        : '-'}
                    </span>
                  </div>

                  <div className="p-4 bg-orange-50 rounded flex flex-col items-center">
                    <span className="text-orange-600 text-xs sm:text-sm font-medium mb-3">Output:</span>
                    {result && (
                      <ImageWithFallback
                        src={result.image}
                        alt={result.output}
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded object-cover mb-3"
                      />
                    )}
                    <span className="text-orange-600 text-xs sm:text-sm text-center">
                      {result
                        ? `${(parseFloat(weight) * 0.2).toFixed(
                            1
                          )} kg ${result.output}`
                        : '-'}
                    </span>
                  </div>

                  <div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded gap-1 sm:gap-0"
                    style={{ backgroundColor: '#f1f8f4' }}
                  >
                    <span className="text-xs sm:text-sm font-medium" style={{ color: '#1b4c2e' }}>Estimated Value:</span>
                    <span className="text-xs sm:text-sm" style={{ color: '#1b4c2e' }}>
                      {result
                        ? `${result.points} ${
                            result.points === 1 ? 'point' : 'points'
                          }`
                        : '-'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-gray-600 text-xs sm:text-sm mb-2">TOTAL:</p>
                  <p className="text-xl sm:text-2xl font-semibold" style={{ color: '#1b4c2e' }}>
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
          <div
            className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full border"
            style={{ borderColor: '#c8e6c9' }}
          >
            <h3
              className="mb-6 text-lg sm:text-xl font-semibold text-center"
              style={{ color: '#1b4c2e' }}
            >
              Check Your Record Points Here
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-xs sm:text-sm mb-2 font-medium"
                  htmlFor="record-id"
                  style={{ color: '#1b4c2e' }}
                >
                  Record ID
                </label>
                <Input
                  id="record-id"
                  type="text"
                  placeholder="BT-"
                  className="bg-white h-10 px-3 sm:px-4 rounded border shadow-sm w-full text-sm"
                  style={{ color: '#1b4c2e', borderColor: '#c8e6c9' }}
                />
              </div>
              <div>
                <label
                  className="block text-xs sm:text-sm mb-2 font-medium"
                  htmlFor="last-name"
                  style={{ color: '#1b4c2e' }}
                >
                  Last Name
                </label>
                <Input
                  id="last-name"
                  type="text"
                  placeholder="Enter your last name"
                  className="bg-white h-10 px-3 sm:px-4 rounded border shadow-sm w-full text-sm"
                  style={{ color: '#1b4c2e', borderColor: '#c8e6c9' }}
                />
              </div>
              <Button
                className="text-white h-10 sm:h-11 px-4 sm:px-6 rounded shadow-md w-full transition-all text-sm sm:text-base font-semibold mt-2"
                style={{ backgroundColor: '#1b4c2e' }}
                onClick={() => alert('Check Record feature coming soon!')}
              >
                Check Record
              </Button>
            </div>
          </div>
        </div>

        {/* TaliPanahATIN Program */}
        <Card
          className="shadow-lg mt-10 sm:mt-12 md:mt-16"
          style={{
            background: 'linear-gradient(to bottom right, #f1f8f4, #e8f5e9)',
            borderColor: '#c8e6c9',
          }}
        >
          <CardHeader
            className="text-center text-white rounded-t-lg p-5 sm:p-6"
            style={{
              background: 'linear-gradient(to right, #1b4c2e, #256d3f)',
            }}
          >
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
              "May Buhay sa Basura ng Barangay"
              <br />
              <span className="text-base sm:text-lg md:text-xl opacity-90">TaliPaPaNatin</span>
            </CardTitle>
            <p className="mt-2 sm:mt-3 opacity-90 text-xs sm:text-sm md:text-base">
              Community Waste Management Programs
            </p>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {programCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-5 sm:p-6 border shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ borderColor: '#c8e6c9' }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0"
                      style={{ backgroundColor: '#1b4c2e' }}
                    >
                      <span className="text-white text-xs sm:text-sm">✓</span>
                    </div>
                    <h4 className="text-xs sm:text-sm md:text-base font-semibold leading-tight" style={{ color: '#1b4c2e' }}>
                      {category.title}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-xs sm:text-sm text-gray-700 flex items-start"
                      >
                        <span
                          className="mr-1.5 sm:mr-2 mt-0.5 sm:mt-1 text-xs flex-shrink-0"
                          style={{ color: '#1b4c2e' }}
                        >
                          ●
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
