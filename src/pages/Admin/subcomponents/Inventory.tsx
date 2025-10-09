import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Box,
  Wrench
} from 'lucide-react';

// Import the subcomponents
import Products from '@/pages/Admin/subcomponents/Products';
import Materials from '@/pages/Admin/subcomponents/Materials';

interface InventoryStats {
  totalProducts: number;
  totalMaterials: number;
  lowStockItems: number;
  outOfStockItems: number;
}

const Inventory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'materials'>('overview');

  // Update tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'products', 'materials'].includes(tab)) {
      setActiveTab(tab as 'overview' | 'products' | 'materials');
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: 'overview' | 'products' | 'materials') => {
    setActiveTab(tab);
    if (tab === 'overview') {
      setSearchParams({});
    } else {
      setSearchParams({ tab });
    }
  };

  // Mock stats data - in real implementation, this would come from API
  const stats: InventoryStats = {
    totalProducts: 24,
    totalMaterials: 18,
    lowStockItems: 5,
    outOfStockItems: 2
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <Products />;
      case 'materials':
        return <Materials />;
      case 'overview':
      default:
        return (
          <div className="space-y-12">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <Card>
                <CardContent className="p-10">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                      <Package className="h-12 w-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <div className="ml-8">
                      <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Total Products</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-10">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                      <Wrench className="h-12 w-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <div className="ml-8">
                      <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Total Materials</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.totalMaterials}</p>
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
                      <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Low Stock Items</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.lowStockItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-10">
                  <div className="flex items-center">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                      <Box className="h-12 w-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <div className="ml-8">
                      <p className="text-base font-medium mb-3" style={{ color: '#838383' }}>Out of Stock</p>
                      <p className="text-4xl font-bold text-gray-900">{stats.outOfStockItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-12">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Button 
                    onClick={() => handleTabChange('products')}
                    className="h-32 flex flex-col items-center justify-center text-xl text-white"
                    style={{ backgroundColor: '#1a4d2e' }}
                  >
                    <div className="p-2 rounded-lg mb-4" style={{ backgroundColor: '#F6F6F6' }}>
                      <Package className="w-12 h-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <span>Manage Products</span>
                  </Button>
                  
                  <Button 
                    onClick={() => handleTabChange('materials')}
                    className="h-32 flex flex-col items-center justify-center text-xl text-white"
                    style={{ backgroundColor: '#1a4d2e' }}
                  >
                    <div className="p-2 rounded-lg mb-4" style={{ backgroundColor: '#F6F6F6' }}>
                      <Wrench className="w-12 h-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <span>Manage Materials</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="h-32 flex flex-col items-center justify-center text-xl border-2"
                    style={{ borderColor: '#1a4d2e', color: '#1a4d2e' }}
                  >
                    <div className="p-2 rounded-lg mb-4" style={{ backgroundColor: '#F6F6F6' }}>
                      <TrendingUp className="w-12 h-12" style={{ color: '#1a4d2e' }} />
                    </div>
                    <span>View Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="mt-12">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl">Recent Inventory Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="flex items-center space-x-6">
                      <div className="p-2 rounded-full" style={{ backgroundColor: '#1a4d2e' }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F6F6F6' }}></div>
                      </div>
                      <span className="text-base font-medium">Organic Compost stock replenished (+50 units)</span>
                    </div>
                    <span className="text-sm" style={{ color: '#838383' }}>2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="flex items-center space-x-6">
                      <div className="p-2 rounded-full" style={{ backgroundColor: '#1a4d2e' }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F6F6F6' }}></div>
                      </div>
                      <span className="text-base font-medium">Garden Tools Set running low (5 units left)</span>
                    </div>
                    <span className="text-sm" style={{ color: '#838383' }}>4 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="flex items-center space-x-6">
                      <div className="p-2 rounded-full" style={{ backgroundColor: '#1a4d2e' }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F6F6F6' }}></div>
                      </div>
                      <span className="text-base font-medium">Liquid Fertilizer out of stock</span>
                    </div>
                    <span className="text-sm" style={{ color: '#838383' }}>6 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="flex items-center space-x-6">
                      <div className="p-2 rounded-full" style={{ backgroundColor: '#1a4d2e' }}>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F6F6F6' }}></div>
                      </div>
                      <span className="text-base font-medium">New product added: Bio-degradable Pots</span>
                    </div>
                    <span className="text-sm" style={{ color: '#838383' }}>1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="mt-12">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#F6F6F6' }}>
                    <AlertTriangle className="w-8 h-8" style={{ color: '#1a4d2e' }} />
                  </div>
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 border-l-4 rounded-lg" style={{ borderColor: '#1a4d2e', backgroundColor: '#F6F6F6' }}>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Garden Tools Set</p>
                      <p className="text-base mt-2" style={{ color: '#838383' }}>Only 5 units remaining</p>
                    </div>
                    <Button size="lg" variant="outline" className="text-base px-6 py-3" style={{ borderColor: '#1a4d2e', color: '#1a4d2e' }}>
                      Restock
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 border-l-4 rounded-lg" style={{ borderColor: '#1a4d2e', backgroundColor: '#F6F6F6' }}>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Seedling Trays</p>
                      <p className="text-base mt-2" style={{ color: '#838383' }}>Only 8 units remaining</p>
                    </div>
                    <Button size="lg" variant="outline" className="text-base px-6 py-3" style={{ borderColor: '#1a4d2e', color: '#1a4d2e' }}>
                      Restock
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-6 border-l-4 rounded-lg" style={{ borderColor: '#838383', backgroundColor: '#F6F6F6' }}>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">Liquid Fertilizer</p>
                      <p className="text-base mt-2" style={{ color: '#838383' }}>Out of stock</p>
                    </div>
                    <Button size="lg" variant="outline" className="text-base px-6 py-3" style={{ borderColor: '#838383', color: '#838383' }}>
                      Urgent Restock
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-lg text-gray-600 mt-3">Manage products and materials for trading</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-2 rounded-lg w-fit mb-8">
        <button
          onClick={() => handleTabChange('overview')}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'overview' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => handleTabChange('products')}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'products' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => handleTabChange('materials')}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            activeTab === 'materials' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Materials
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Inventory;