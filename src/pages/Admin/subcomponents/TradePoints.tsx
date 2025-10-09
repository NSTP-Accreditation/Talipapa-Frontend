import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Package,
  TrendingDown,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  Minus
} from 'lucide-react';

interface TradePointsTransaction {
  id: string;
  date: string;
  userId: string;
  userName: string;
  itemType: 'product' | 'material';
  itemName: string;
  pointsRequired: number;
  quantity: number;
  totalPoints: number;
  status: 'completed' | 'pending' | 'cancelled';
  processedBy?: string;
  notes?: string;
}

interface AvailableItem {
  id: string;
  name: string;
  type: 'product' | 'material';
  pointsRequired: number;
  stock: number;
  description: string;
  image?: string;
}

// Mock data for available items
const availableItems: AvailableItem[] = [
  {
    id: 'P001',
    name: 'Organic Compost (5kg)',
    type: 'product',
    pointsRequired: 10,
    stock: 50,
    description: 'High-quality organic compost for gardening'
  },
  {
    id: 'P002',
    name: 'Liquid Fertilizer (1L)',
    type: 'product',
    pointsRequired: 15,
    stock: 30,
    description: 'Nutrient-rich liquid fertilizer'
  },
  {
    id: 'M001',
    name: 'Seedling Trays',
    type: 'material',
    pointsRequired: 5,
    stock: 100,
    description: 'Biodegradable seedling trays'
  },
  {
    id: 'M002',
    name: 'Garden Tools Set',
    type: 'material',
    pointsRequired: 25,
    stock: 20,
    description: 'Basic gardening tools set'
  }
];

// Mock data for transactions
const mockTransactions: TradePointsTransaction[] = [
  {
    id: 'TP-001',
    date: '2024-10-09',
    userId: 'U001',
    userName: 'Juan Dela Cruz',
    itemType: 'product',
    itemName: 'Organic Compost (5kg)',
    pointsRequired: 10,
    quantity: 1,
    totalPoints: 10,
    status: 'completed',
    processedBy: 'Admin User',
    notes: 'Delivered successfully'
  },
  {
    id: 'TP-002',
    date: '2024-10-09',
    userId: 'U002',
    userName: 'Maria Santos',
    itemType: 'material',
    itemName: 'Garden Tools Set',
    pointsRequired: 25,
    quantity: 1,
    totalPoints: 25,
    status: 'pending',
    notes: 'Waiting for item availability'
  }
];

const TradePoints: React.FC = () => {
  const [transactions, setTransactions] = useState<TradePointsTransaction[]>(mockTransactions);
  const [items, setItems] = useState<AvailableItem[]>(availableItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'items'>('transactions');
  
  const [newTransaction, setNewTransaction] = useState({
    userId: '',
    userName: '',
    itemId: '',
    quantity: 1,
    notes: ''
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.itemType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const completeTransaction = (id: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'completed' as const, processedBy: 'Admin User' }
          : t
      )
    );
  };

  const cancelTransaction = (id: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'cancelled' as const, processedBy: 'Admin User' }
          : t
      )
    );
  };

  const handleAddTransaction = () => {
    const selectedItem = items.find(item => item.id === newTransaction.itemId);
    if (!selectedItem) return;

    const totalPoints = selectedItem.pointsRequired * newTransaction.quantity;
    const transaction: TradePointsTransaction = {
      id: `TP-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      userId: newTransaction.userId,
      userName: newTransaction.userName,
      itemType: selectedItem.type,
      itemName: selectedItem.name,
      pointsRequired: selectedItem.pointsRequired,
      quantity: newTransaction.quantity,
      totalPoints,
      status: 'pending',
      notes: newTransaction.notes
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ userId: '', userName: '', itemId: '', quantity: 1, notes: '' });
    setShowAddModal(false);
  };

  const updateItemStock = (itemId: string, change: number) => {
    setItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, stock: Math.max(0, item.stock + change) }
          : item
      )
    );
  };

  const totalPointsTraded = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.totalPoints, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trade Points Management</h1>
          <p className="text-gray-600 mt-2">Manage point redemption and item distribution</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setShowAddModal(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            New Trade
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points Traded</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsTraded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Trades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {items.filter(item => item.stock > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Traders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(transactions.map(t => t.userId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'transactions' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'items' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Available Items
        </button>
      </div>

      {activeTab === 'transactions' && (
        <>
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by user, transaction ID, or item name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All Types</option>
                    <option value="product">Products</option>
                    <option value="material">Materials</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Trade Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Item</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Quantity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Points</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                        <td className="py-3 px-4">{transaction.date}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{transaction.userName}</p>
                            <p className="text-sm text-gray-500">{transaction.userId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{transaction.itemName}</p>
                            <p className="text-sm text-gray-500 capitalize">{transaction.itemType}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{transaction.quantity}</td>
                        <td className="py-3 px-4 font-medium text-red-600">
                          -{transaction.totalPoints}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {transaction.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => completeTransaction(transaction.id)}
                                  className="text-green-600 hover:bg-green-50"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => cancelTransaction(transaction.id)}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredTransactions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No transactions found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'items' && (
        <Card>
          <CardHeader>
            <CardTitle>Available Items for Trading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      {item.pointsRequired} pts
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      Stock: {item.stock}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemStock(item.id, -1)}
                        disabled={item.stock === 0}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateItemStock(item.id, 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Trade</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">User ID</label>
                <Input
                  value={newTransaction.userId}
                  onChange={(e) => setNewTransaction(prev => ({...prev, userId: e.target.value}))}
                  placeholder="Enter user ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">User Name</label>
                <Input
                  value={newTransaction.userName}
                  onChange={(e) => setNewTransaction(prev => ({...prev, userName: e.target.value}))}
                  placeholder="Enter user name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Item</label>
                <select
                  value={newTransaction.itemId}
                  onChange={(e) => setNewTransaction(prev => ({...prev, itemId: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select item</option>
                  {items.filter(item => item.stock > 0).map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.pointsRequired} pts (Stock: {item.stock})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={newTransaction.quantity}
                  onChange={(e) => setNewTransaction(prev => ({...prev, quantity: Number(e.target.value)}))}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <Input
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Add any notes"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleAddTransaction}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!newTransaction.userId || !newTransaction.itemId || !newTransaction.quantity}
              >
                Create Trade
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

export default TradePoints;