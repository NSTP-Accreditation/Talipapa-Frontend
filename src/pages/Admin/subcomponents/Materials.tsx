import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Recycle,
  Leaf,
  Trash2
} from 'lucide-react';

interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
  image?: string;
}

// Mock data based on the image
const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'PET Bottles',
    pointsPerKg: 50,
  },
  {
    id: '2', 
    name: 'Single (Hard) Use Plastic',
    pointsPerKg: 40,
  },
  {
    id: '3',
    name: 'Candy & Chichirya Wrapper',
    pointsPerKg: 5,
  },
  {
    id: '4',
    name: 'Plastic Bags/Food Wrapping (e.g Bread, Vegetables, Fruit)',
    pointsPerKg: 20,
  },
  {
    id: '5',
    name: 'Food Takeaways Containers',
    pointsPerKg: 10,
  },
  {
    id: '6',
    name: 'Water Cooler Bottles, Baby Cups, Fiber Glass',
    pointsPerKg: 15,
  },
  {
    id: '7',
    name: 'Paper/CardboardH',
    pointsPerKg: 45,
  },
  {
    id: '8',
    name: 'Used Cotton Clothes',
    pointsPerKg: 25,
  }
];

const Materials: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('By Category');
  const [sortBy, setSortBy] = useState('Sort By');
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    pointsPerKg: 0
  });

  const filteredMaterials = materials.filter(material => 
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMaterial = () => {
    const material: Material = {
      id: String(materials.length + 1),
      name: newMaterial.name,
      pointsPerKg: newMaterial.pointsPerKg
    };

    setMaterials(prev => [material, ...prev]);
    setNewMaterial({ name: '', pointsPerKg: 0 });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Materials Inventory</h2>
          <p className="text-lg" style={{ color: '#838383' }}>
            Track recyclable materials and their point values
          </p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="text-white font-semibold px-8 py-4 text-lg"
          style={{ backgroundColor: '#1a4d2e' }}
        >
          <div className="p-1 rounded mr-4" style={{ backgroundColor: '#F6F6F6' }}>
            <Plus className="w-6 h-6" style={{ color: '#1a4d2e' }} />
          </div>
          Add Material
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-12">
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Recycle className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Total Materials</p>
                <p className="text-4xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Package className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>High Value</p>
                <p className="text-4xl font-bold text-gray-900">{materials.filter(m => m.pointsPerKg >= 40).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Leaf className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Medium Value</p>
                <p className="text-4xl font-bold text-gray-900">{materials.filter(m => m.pointsPerKg >= 15 && m.pointsPerKg < 40).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Trash2 className="h-12 w-12" style={{ color: '#838383' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Low Value</p>
                <p className="text-4xl font-bold text-gray-900">{materials.filter(m => m.pointsPerKg < 15).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mt-12">
        <CardContent className="p-10">
          <div className="flex items-center space-x-8">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Search className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
              <Input
                placeholder="Search By"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-16 py-5 text-lg"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Filter className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-6 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-lg min-w-56 font-medium"
                style={{ color: '#838383', borderColor: '#1a4d2e' }}
              >
                <option>Filter By Category</option>
                <option>Plastic</option>
                <option>Paper</option>
                <option>Textiles</option>
              </select>
              <div className="p-2 rounded-lg -ml-4" style={{ backgroundColor: '#F6F6F6' }}>
                <ChevronDown className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-lg min-w-48 font-medium"
                style={{ color: '#838383', borderColor: '#1a4d2e' }}
              >
                <option>Sort By</option>
                <option>Points (High to Low)</option>
                <option>Points (Low to High)</option>
                <option>Name (A-Z)</option>
              </select>
              <div className="p-2 rounded-lg -ml-4" style={{ backgroundColor: '#F6F6F6' }}>
                <ChevronDown className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Table */}
      <Card className="mt-12">
        <CardContent className="p-10">
          <div className="space-y-4">
            {/* Table Header */}
            <div className="flex items-center py-6 border-b-2 border-gray-200 mb-8">
              <div className="flex-1">
                <span className="font-bold text-black text-xl">Name</span>
              </div>
              <div className="w-48 text-right">
                <span className="font-bold text-black text-xl">Points per KG</span>
              </div>
            </div>

            {/* Table Rows */}
            {filteredMaterials.map((material) => (
              <div key={material.id} className="flex items-center py-10 rounded-lg px-8 transition-colors" style={{ backgroundColor: '#F6F6F6' }}>
                <div className="flex items-center flex-1 space-x-8">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'white' }}>
                    <div className="w-20 h-20 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}></div>
                  </div>
                  <span className="text-black text-lg font-semibold">{material.name}</span>
                </div>
                <div className="w-48 text-right">
                  <span 
                    className="px-6 py-4 rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: '#1a4d2e' }}
                  >
                    {material.pointsPerKg} pts/kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-6 mt-12 pt-10 border-t-2" style={{ borderColor: '#F6F6F6' }}>
            <button className="p-4 rounded-lg border-2 transition-colors" style={{ borderColor: '#1a4d2e' }}>
              <div className="p-1 rounded" style={{ backgroundColor: '#F6F6F6' }}>
                <ChevronLeft className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
            </button>
            <button className="px-8 py-4 text-white rounded-lg font-semibold text-lg" style={{ backgroundColor: '#1a4d2e' }}>
              1
            </button>
            <button className="p-4 rounded-lg border-2 transition-colors" style={{ borderColor: '#1a4d2e' }}>
              <div className="p-1 rounded" style={{ backgroundColor: '#F6F6F6' }}>
                <ChevronRight className="w-6 h-6" style={{ color: '#838383' }} />
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Material</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Material Name</label>
                <Input
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter material name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Points per KG</label>
                <Input
                  type="number"
                  value={newMaterial.pointsPerKg}
                  onChange={(e) => setNewMaterial(prev => ({...prev, pointsPerKg: Number(e.target.value)}))}
                  placeholder="Points per kilogram"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddMaterial}
                className="flex-1 text-white font-medium"
                style={{ backgroundColor: '#1a4d2e' }}
                disabled={!newMaterial.name || !newMaterial.pointsPerKg}
              >
                Add Material
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;