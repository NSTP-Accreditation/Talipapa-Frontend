import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  User,
  Package,
  TrendingUp
} from 'lucide-react';

interface TradeRecord {
  id: string;
  date: string;
  userId: string;
  userName: string;
  wasteType: string;
  quantity: number;
  pointsEarned: number;
  status: 'completed' | 'pending' | 'cancelled';
  transactionType: 'earn' | 'trade';
}

// Mock data for demonstration
const mockRecords: TradeRecord[] = [
  {
    id: 'TR-001',
    date: '2024-10-09',
    userId: 'U001',
    userName: 'Juan Dela Cruz',
    wasteType: 'Plastic Bottles',
    quantity: 15,
    pointsEarned: 15,
    status: 'completed',
    transactionType: 'earn'
  },
  {
    id: 'TR-002',
    date: '2024-10-08',
    userId: 'U002',
    userName: 'Maria Santos',
    wasteType: 'Paper & Cardboard',
    quantity: 8,
    pointsEarned: 8,
    status: 'completed',
    transactionType: 'earn'
  },
  {
    id: 'TR-003',
    date: '2024-10-08',
    userId: 'U001',
    userName: 'Juan Dela Cruz',
    wasteType: 'Compost',
    quantity: 5,
    pointsEarned: -10,
    status: 'completed',
    transactionType: 'trade'
  }
];

const Records: React.FC = () => {
  const [records, setRecords] = useState<TradeRecord[]>(mockRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.wasteType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesType = filterType === 'all' || record.transactionType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const getTransactionTypeColor = (type: string) => {
    return type === 'earn' ? 'text-green-600' : 'text-blue-600';
  };

  const exportRecords = () => {
    // Logic to export records as CSV or Excel
    console.log('Exporting records...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Records</h1>
          <p className="text-gray-600 mt-2">View and manage all trading transactions</p>
        </div>
        <Button onClick={exportRecords} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export Records
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {records.filter(r => r.transactionType === 'earn').reduce((sum, r) => sum + r.pointsEarned, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(records.map(r => r.userId)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Records</p>
                <p className="text-2xl font-bold text-gray-900">
                  {records.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
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
                  placeholder="Search by user, ID, or waste type..."
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
                <option value="earn">Earn Points</option>
                <option value="trade">Trade Points</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Records</CardTitle>
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
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{record.id}</td>
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{record.userName}</p>
                        <p className="text-sm text-gray-500">{record.userId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{record.wasteType}</td>
                    <td className="py-3 px-4">{record.quantity} kg</td>
                    <td className={`py-3 px-4 font-medium ${getTransactionTypeColor(record.transactionType)}`}>
                      {record.pointsEarned > 0 ? '+' : ''}{record.pointsEarned}
                    </td>
                    <td className="py-3 px-4 capitalize">{record.transactionType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No records found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Records;