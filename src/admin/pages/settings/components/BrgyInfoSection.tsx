import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useBrgyInfo } from '@/contexts/BrgyInfoContext';
import { useToast } from '@/hooks/useToast';
import { AlertCircle, Building, Check, Pencil, Upload, X } from 'lucide-react';
import { useState } from 'react';


const BrngyInfoSection = () => {
  const { pageContent, loading, error: brgyInfoError } = useBrgyInfo();

  const authFetch = useAuthFetch();
  const { success, error } = useToast();
  const [editingBarangay, setEditingBarangay] = useState<boolean>(false);
  const [isSavingBarangay, setIsSavingBarangay] = useState<boolean>(false);
  const [barangayName, setBarangayName] = useState<string>(pageContent?.barangayName);
  
  const [logoPreview, setLogoPreview] = useState<string>(pageContent?.image?.url);
  
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);

  const handleBarangayNameSave = async () => {
    if (!barangayName.trim()) {
      error('Barangay name cannot be empty', {
        title: 'Validation Error',
      });
      return;
    }

    setIsSavingBarangay(true);
    try {
      await authFetch(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`, {
        method: 'PATCH',
        body: JSON.stringify({
          barangayName: barangayName,
        }),
      });
      success('Barangay name updated successfully', { title: 'Success' });
      setEditingBarangay(false);
    } catch (error) {
      console.error(error);
      error('Failed to update barangay name', { title: 'Error' });
    } finally {
      setIsSavingBarangay(false);
    }
  };

  const handleLogoUpload = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      if (file.size > 2 * 1024 * 1024) {
        error('File size should be less than 2MB', {
          title: 'File Error',
        });
        return;
      }
  
      if (!file.type.startsWith('image/')) {
        error('Please select an image file', { title: 'File Error' });
        return;
      }
  
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('image', file);
  
      try {
        await authFetch(
          `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}/withImage`,
          {
            method: 'PATCH',
            body: formData,
          }
        );
  
        // setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
  
        success('Barangay logo updated successfully', {
          title: 'Success',
        });
      } catch (error) {
        console.error(error);
        error('Failed to upload logo', { title: 'Error' });
      } finally {
        setIsUploadingLogo(false);
      }
    };

  return (
    <Card className="shadow-md border border-gray-200 overflow-hidden">
      <CardHeader className="pb-6 bg-gradient-to-r from-green-50 to-white border-b border-gray-200">
        <CardTitle className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-100">
            <Building className="w-6 h-6 text-green-600" />
          </div>
          Barangay Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:p-8 space-y-8">
        {/* Barangay Name */}
        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-700">
            Barangay Name
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {editingBarangay ? (
              <>
                <input
                  type="text"
                  value={barangayName}
                  onChange={(e) => setBarangayName(e.target.value)}
                  className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                  placeholder="Enter barangay name"
                />
                <div className="flex gap-2 sm:flex-shrink-0">
                  <button
                    onClick={handleBarangayNameSave}
                    disabled={isSavingBarangay}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSavingBarangay ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingBarangay(false)}
                    disabled={isSavingBarangay}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-sm disabled:opacity-50"
                  >
                    <X className="w-4 h-4 inline mr-1" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 px-4 py-3 text-lg bg-gray-50 border border-gray-200 rounded-lg font-semibold text-gray-900">
                  {barangayName || 'Not set'}
                </div>
                <button
                  onClick={() => setEditingBarangay(true)}
                  className="sm:flex-shrink-0 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {/* Barangay Logo */}
        <div className="space-y-4">
          <label className="block text-base font-semibold text-gray-700">
            Barangay Logo
          </label>
          <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
            <div className="w-48 h-48 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-400 transition-all mx-auto lg:mx-0 shadow-inner">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Barangay logo"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-500 text-sm font-semibold">
                    No Logo
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4 flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
                disabled={isUploadingLogo}
              />
              <label
                htmlFor="logo-upload"
                className={`inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all shadow-sm w-full lg:w-auto ${
                  isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploadingLogo ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload New Logo
                  </>
                )}
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Upload Requirements
                </p>
                <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                  <li>Recommended size: 200x200px or larger</li>
                  <li>Maximum file size: 2MB</li>
                  <li>Supported formats: JPG, PNG, GIF</li>
                  <li>Use transparent background for best results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrngyInfoSection;
