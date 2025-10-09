import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Coins,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit
} from 'lucide-react';

interface EarnPointsTransaction {
  id: string;
  date: string;
  userId: string;
  userName: string;
  wasteType: string;
  quantity: number;
  pointsPerKg: number;
  totalPoints: number;
  status: 'approved' | 'pending' | 'rejected';
  verifiedBy?: string;
  notes?: string;
}

// Mock data for demonstration
const mockTransactions: EarnPointsTransaction[] = [
  {
    id: 'EP-001',
    date: '2024-10-09',
    userId: 'U001',
    userName: 'Juan Dela Cruz',
    wasteType: 'Plastic Bottles',
    quantity: 15,
    pointsPerKg: 1,
    totalPoints: 15,
    status: 'approved',
    verifiedBy: 'Admin User',
    notes: 'Clean plastic bottles, properly sorted'
  },
  {
    id: 'EP-002',
    date: '2024-10-09',
    userId: 'U002',
    userName: 'Maria Santos',
    wasteType: 'Paper & Cardboard',
    quantity: 8,
    pointsPerKg: 1,
    totalPoints: 8,
    status: 'pending',
    notes: 'Awaiting verification'
  },
  {
    id: 'EP-003',
    date: '2024-10-08',
    userId: 'U003',
    userName: 'Pedro Garcia',
    wasteType: 'Organic Waste',
    quantity: 12,
    pointsPerKg: 1,
    totalPoints: 12,
    status: 'rejected',
    verifiedBy: 'Admin User',
    notes: 'Mixed waste, contains non-organic items'
  }
];

const wasteTypes = [
  { value: 'plastic-bottles', label: 'Plastic Bottles', pointsPerKg: 1 },
  { value: 'paper-cardboard', label: 'Paper & Cardboard', pointsPerKg: 1 },
  { value: 'organic-waste', label: 'Organic Waste', pointsPerKg: 1 },
  { value: 'cans-metal', label: 'Cans & Metal', pointsPerKg: 2 },
];

const EarnPoints: React.FC = () => {
  const [transactions, setTransactions] = useState<EarnPointsTransaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    userId: '',
    userName: '',
    wasteType: '',
    quantity: 0,
    notes: ''
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const approveTransaction = (id: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'approved' as const, verifiedBy: 'Admin User' }
          : t
      )
    );
  };

  const rejectTransaction = (id: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === id 
          ? { ...t, status: 'rejected' as const, verifiedBy: 'Admin User' }
          : t
      )
    );
  };

  const handleAddTransaction = () => {
    const wasteType = wasteTypes.find(w => w.value === newTransaction.wasteType);
    if (!wasteType) return;

    const totalPoints = newTransaction.quantity * wasteType.pointsPerKg;
    const transaction: EarnPointsTransaction = {
      id: `EP-${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      userId: newTransaction.userId,
      userName: newTransaction.userName,
      wasteType: wasteType.label,
      quantity: newTransaction.quantity,
      pointsPerKg: wasteType.pointsPerKg,
      totalPoints,
      status: 'pending',
      notes: newTransaction.notes
    };

    setTransactions(prev => [transaction, ...prev]);
    setNewTransaction({ userId: '', userName: '', wasteType: '', quantity: 0, notes: '' });
    setShowAddModal(false);
  };

  const totalPointsAwarded = transactions
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + t.totalPoints, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Earn Points Management</h1>
          <p className="text-gray-600 mt-2">Manage waste submission and point allocation</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points Awarded</p>
                <p className="text-2xl font-bold text-gray-900">{totalPointsAwarded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(transactions.map(t => t.userId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by user, transaction ID, or waste type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Points Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Waste Type</th>
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
                    <td className="py-3 px-4">{transaction.wasteType}</td>
                    <td className="py-3 px-4">{transaction.quantity} kg</td>
                    <td className="py-3 px-4 font-medium text-green-600">
                      +{transaction.totalPoints}
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
                              onClick={() => approveTransaction(transaction.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => rejectTransaction(transaction.id)}
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

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
            
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
                <label className="block text-sm font-medium mb-2">Waste Type</label>
                <select
                  value={newTransaction.wasteType}
                  onChange={(e) => setNewTransaction(prev => ({...prev, wasteType: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select waste type</option>
                  {wasteTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} ({type.pointsPerKg} pts/kg)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Quantity (kg)</label>
                <Input
                  type="number"
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
                disabled={!newTransaction.userId || !newTransaction.wasteType || !newTransaction.quantity}
              >
                Add Transaction
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

export default EarnPoints;