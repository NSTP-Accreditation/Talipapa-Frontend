import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../../components/ui/card';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor';
}

const Settings: React.FC = () => {
  const [barangayName, setBarangayName] = useState('Barangay San Isidro');
  const [colorScheme, setColorScheme] = useState<'Green' | 'White'>('Green');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [editingBarangay, setEditingBarangay] = useState(false);

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id: 1, name: 'Admin User', email: 'admin@sanisidro.gov.ph', role: 'Super Admin' },
    { id: 2, name: 'Secretary', email: 'secretary@sanisidro.gov.ph', role: 'Editor' }
  ]);

  // New admin form state
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor' as 'Super Admin' | 'Editor'
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size should be less than 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBarangayNameSave = () => {
    // Here you would typically save to backend
    setEditingBarangay(false);
    console.log('Saving barangay name:', barangayName);
  };

  const handleDeleteAdmin = (id: number) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdminUsers(adminUsers.filter(user => user.id !== id));
    }
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert('Please fill in all fields');
      return;
    }
    
    const newId = Math.max(...adminUsers.map(u => u.id)) + 1;
    setAdminUsers([...adminUsers, { ...newAdmin, id: newId }]);
    setNewAdmin({ name: '', email: '', password: '', role: 'Editor' });
    alert('Admin added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-sm" style={{marginBottom: '48px'}}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600 text-lg">
            Manage system configuration and preferences
          </p>
        </div>

        {/* Barangay Information */}
        <Card className="shadow-sm" style={{marginBottom: '48px'}}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Barangay Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Barangay Name
            </label>
            <div className="flex items-center gap-3">
              {editingBarangay ? (
                <>
                  <input
                    type="text"
                    value={barangayName}
                    onChange={(e) => setBarangayName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleBarangayNameSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBarangay(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1 px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                    {barangayName}
                  </div>
                  <button
                    onClick={() => setEditingBarangay(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Barangay Logo
            </label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-500 text-3xl font-bold">B</span>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md cursor-pointer text-sm flex items-center gap-2 font-medium"
                >
                  📁 Upload New Logo
                </label>
                <p className="text-sm text-gray-500">
                  Recommended size: 200x200px
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

        {/* Theme Settings */}
        <Card className="shadow-sm" style={{marginBottom: '48px'}}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Theme Settings</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Color Scheme
              </label>
              <div className="flex gap-6">
                <button
                  onClick={() => setColorScheme('Green')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    colorScheme === 'Green'
                      ? 'bg-green-600 text-white border-green-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-green-300'
                  }`}
                >
                  <div className="w-5 h-5 bg-green-600 rounded"></div>
                  Green
                </button>
                <button
                  onClick={() => setColorScheme('White')}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                    colorScheme === 'White'
                      ? 'bg-gray-700 text-white border-gray-700 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="w-5 h-5 bg-white border border-gray-400 rounded"></div>
                  White
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Currently using {colorScheme.toLowerCase()} and white palette
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Admin Accounts */}
        <Card className="shadow-sm" style={{marginBottom: '48px'}}>
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Admin Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
          {adminUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xl">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-900 text-lg">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  user.role === 'Super Admin' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
                <button
                  onClick={() => handleDeleteAdmin(user.id)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete admin"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

        {/* Add New Admin */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Add New Admin</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Secure password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Role
                </label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as 'Super Admin' | 'Editor'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="Editor">Editor</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
          </div>
            <div className="md:col-span-2 mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={handleAddAdmin}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-md hover:shadow-lg"
              >
                ➕ Add Admin Account
              </button>
            </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Settings;
