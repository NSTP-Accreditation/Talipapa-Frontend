import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  pointsRequired: number;
  stock: number;
  minStock: number;
  description: string;
  status: 'available' | 'low_stock' | 'out_of_stock';
  dateAdded: string;
  image?: string;
}

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Organic Compost (5kg)',
    category: 'Fertilizer',
    pointsRequired: 10,
    stock: 45,
    minStock: 10,
    description: 'High-quality organic compost made from processed waste materials',
    status: 'available',
    dateAdded: '2024-09-15'
  },
  {
    id: 'P002',
    name: 'Liquid Fertilizer (1L)',
    category: 'Fertilizer',
    pointsRequired: 15,
    stock: 0,
    minStock: 5,
    description: 'Concentrated liquid fertilizer rich in nutrients',
    status: 'out_of_stock',
    dateAdded: '2024-09-20'
  },
  {
    id: 'P003',
    name: 'Bio-degradable Plant Pots (Set of 10)',
    category: 'Containers',
    pointsRequired: 8,
    stock: 3,
    minStock: 10,
    description: 'Environmentally friendly plant pots made from recycled materials',
    status: 'low_stock',
    dateAdded: '2024-10-01'
  },
  {
    id: 'P004',
    name: 'Vermicompost (3kg)',
    category: 'Fertilizer',
    pointsRequired: 12,
    stock: 25,
    minStock: 8,
    description: 'Premium vermicompost produced from organic waste',
    status: 'available',
    dateAdded: '2024-10-05'
  }
];

const categories = ['All', 'Fertilizer', 'Containers', 'Seeds', 'Tools'];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    pointsRequired: 0,
    stock: 0,
    minStock: 0,
    description: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'out_of_stock':
        return <Package className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'low_stock':
        return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const updateProductStatus = (product: Product): Product => {
    let status: Product['status'] = 'available';
    if (product.stock === 0) {
      status = 'out_of_stock';
    } else if (product.stock <= product.minStock) {
      status = 'low_stock';
    }
    return { ...product, status };
  };

  const handleAddProduct = () => {
    const product: Product = {
      id: `P${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      category: newProduct.category,
      pointsRequired: newProduct.pointsRequired,
      stock: newProduct.stock,
      minStock: newProduct.minStock,
      description: newProduct.description,
      status: 'available',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updatedProduct = updateProductStatus(product);
    setProducts(prev => [updatedProduct, ...prev]);
    setNewProduct({ name: '', category: '', pointsRequired: 0, stock: 0, minStock: 0, description: '' });
    setShowAddModal(false);
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    const updatedProduct = updateProductStatus(editingProduct);
    setProducts(prev => 
      prev.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      )
    );
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => 
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, stock: Math.max(0, newStock) };
          return updateProductStatus(updated);
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Products Management</h2>
          <p className="text-lg" style={{ color: '#838383' }}>Manage products available for trading</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="text-white font-semibold px-8 py-4 text-lg"
          style={{ backgroundColor: '#1a4d2e' }}
        >
          <div className="p-1 rounded mr-4" style={{ backgroundColor: '#F6F6F6' }}>
            <Plus className="w-6 h-6" style={{ color: '#1a4d2e' }} />
          </div>
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-12">
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Package className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Total Products</p>
                <p className="text-4xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <CheckCircle className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Available</p>
                <p className="text-4xl font-bold text-gray-900">{products.filter(p => p.status === 'available').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <AlertTriangle className="h-12 w-12" style={{ color: '#1a4d2e' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Low Stock</p>
                <p className="text-4xl font-bold text-gray-900">{products.filter(p => p.status === 'low_stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-10">
            <div className="flex items-center">
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                <Package className="h-12 w-12" style={{ color: '#838383' }} />
              </div>
              <div className="ml-8">
                <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Out of Stock</p>
                <p className="text-4xl font-bold text-gray-900">{products.filter(p => p.status === 'out_of_stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mt-12">
        <CardContent className="p-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                  <Search className="w-6 h-6" style={{ color: '#838383' }} />
                </div>
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 py-5 text-lg"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Points Required</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{product.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500 max-w-xs truncate">{product.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4 font-medium">{product.pointsRequired} pts</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStock(product.id, product.stock - 1)}
                          disabled={product.stock === 0}
                        >
                          -
                        </Button>
                        <span className="font-medium min-w-[3rem] text-center">{product.stock}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStock(product.id, product.stock + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(product.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No products found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({...prev, name: e.target.value}))}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({...prev, category: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Points Required</label>
                <Input
                  type="number"
                  value={newProduct.pointsRequired}
                  onChange={(e) => setNewProduct(prev => ({...prev, pointsRequired: Number(e.target.value)}))}
                  placeholder="Points required to get this product"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Initial Stock</label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(prev => ({...prev, stock: Number(e.target.value)}))}
                  placeholder="Initial stock quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Stock Level</label>
                <Input
                  type="number"
                  value={newProduct.minStock}
                  onChange={(e) => setNewProduct(prev => ({...prev, minStock: Number(e.target.value)}))}
                  placeholder="Minimum stock for low stock alert"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({...prev, description: e.target.value}))}
                  placeholder="Product description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddProduct}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!newProduct.name || !newProduct.category || !newProduct.pointsRequired}
              >
                Add Product
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name</label>
                <Input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, name: e.target.value} : null)}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, category: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.filter(c => c !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Points Required</label>
                <Input
                  type="number"
                  value={editingProduct.pointsRequired}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, pointsRequired: Number(e.target.value)} : null)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Current Stock</label>
                <Input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, stock: Number(e.target.value)} : null)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Minimum Stock Level</label>
                <Input
                  type="number"
                  value={editingProduct.minStock}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, minStock: Number(e.target.value)} : null)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct(prev => prev ? {...prev, description: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleEditProduct}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingProduct(null)}
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

export default Products;