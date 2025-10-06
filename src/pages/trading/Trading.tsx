import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { MapPin, Phone, User } from 'lucide-react';

interface WasteType {
  value: string;
  label: string;
  rate: number;
  output: string;
  image: string;
}

const wasteTypes: WasteType[] = [
  {
    value: 'plastic-bottles',
    label: 'Plastic Bottles',
    rate: 1,
    output: 'Good Soil',
    image: 'https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJkZW4lMjBzb2lsJTIwY29tcG9zdHxlbnwxfHx8fDE3NTk1NjAyMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'paper-cardboard',
    label: 'Paper & Cardboard',
    rate: 1,
    output: 'Fertilizer',
    image: 'https://images.unsplash.com/photo-1539902879984-7a1fa3844e48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmVydGlsaXplciUyMHNvaWwlMjBjb25kaXRpb25lcnxlbnwxfHx8fDE3NTk1NjAyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'organic-waste',
    label: 'Organic Waste',
    rate: 1,
    output: 'Compost',
    image: 'https://images.unsplash.com/photo-1708432331128-cfe5a2803781?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wb3N0JTIwb3JnYW5pYyUyMHdhc3RlJTIwZmVydGlsaXplcnxlbnwxfHx8fDE3NTk1NjAyMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    value: 'cans-metal',
    label: 'Cans & Metal',
    rate: 1,
    output: 'Vermitech/Liquid Conditioner',
    image: 'https://images.unsplash.com/photo-1678129456841-47b1aca89e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXJtaWNvbXBvc3QlMjBsaXF1aWQlMjBmZXJ0aWxpemVyJTIwdGVhfGVufDF8fHx8MTc1OTU2MDIyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export default function App() {
  const [selectedType, setSelectedType] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<{
    points: number;
    output: string;
    image: string;
  } | null>(null);

  const handleConvert = () => {
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Saturday, October 5, 2024</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span className="text-sm">1425 PM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Tabligaon</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-green-500 hover:bg-gray-100"
              >
                <User className="w-4 h-4 mr-1" />
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="mb-2">Waste Conversion Calculator</h1>
          <p className="text-gray-600">
            Calculate how much valuable product you can get from your recyclable waste
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          {/* Input Panel */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-green-700 mb-2">
                  Select Recyclable Type:
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white border-green-300">
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
                <label className="block text-sm text-green-700 mb-2">
                  Enter weight (e.g., 2.5 kg):
                </label>
                <Input
                  type="number"
                  placeholder="2 KG"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-white border-green-300"
                />
              </div>

              <Button
                onClick={handleConvert}
                className="w-full bg-green-500 hover:bg-green-600"
                disabled={!selectedType || !weight}
              >
                Convert
              </Button>
            </CardContent>
          </Card>

          {/* Result Panel */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-700">Result</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div>
                  <p>Points: {result.points}</p>
                  <p>Output: {result.output}</p>
                  <img src={result.image} alt={result.output} className="w-16 h-16" />
                </div>
              ) : (
                <p>No result yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}