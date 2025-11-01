import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useBrgyInfo } from '@/contexts/BrgyInfoContext';
import { useToast } from '@/hooks/useToast';
import { AlertCircle, Building, Check, Pencil, Upload, X } from 'lucide-react';
import { useState } from 'react';

const BrngyInfoSection = () => {
  const { pageContent, loading, error: brgyInfoError, refetch } = useBrgyInfo();

  const authFetch = useAuthFetch();
  const { success, error } = useToast();
  const [editingBarangay, setEditingBarangay] = useState<boolean>(false);
  const [isSavingBarangay, setIsSavingBarangay] = useState<boolean>(false);
  const [barangayName, setBarangayName] = useState<string>(
    pageContent?.barangayName
  );

  const [logoPreview, setLogoPreview] = useState<string>(
    pageContent?.image?.url
  );

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
      refetch();
    } catch (err) {
      console.error(err);
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
    <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span>Barangay Information</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
          Configure your barangay's official name and logo
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-white to-gray-50">
        {/* Barangay Name */}
        <div className="space-y-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
          <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
            <span className="text-green-600">•</span>
            Barangay Name
            {!editingBarangay && (
              <span className="text-xs font-normal text-gray-500">
                (Click edit to change)
              </span>
            )}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            {editingBarangay ? (
              <>
                <input
                  type="text"
                  value={barangayName}
                  onChange={(e) => setBarangayName(e.target.value)}
                  className="flex-1 px-4 py-3 text-sm sm:text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm font-semibold"
                  placeholder="Enter barangay name"
                  autoFocus
                />
                <div className="flex gap-2 sm:flex-shrink-0">
                  <button
                    onClick={handleBarangayNameSave}
                    disabled={isSavingBarangay || !barangayName.trim()}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                  >
                    {isSavingBarangay ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingBarangay(false);
                      setBarangayName(pageContent?.barangayName);
                    }}
                    disabled={isSavingBarangay}
                    className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 text-white font-bold rounded-xl hover:bg-gray-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm sm:text-base flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1 px-4 py-3 text-sm sm:text-lg bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl font-bold text-gray-900 flex items-center min-h-[44px]">
                  <Building className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                  {barangayName || (
                    <span className="text-gray-400 italic">Not set</span>
                  )}
                </div>
                <button
                  onClick={() => setEditingBarangay(true)}
                  className="sm:flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                >
                  <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Edit</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Barangay Logo */}
        <div className="space-y-4 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
          <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
            <span className="text-green-600">•</span>
            Barangay Logo
            <span className="text-xs font-normal text-gray-500">
              (Official emblem)
            </span>
          </label>
          <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
            <div className="relative group w-full lg:w-auto">
              <div className="w-full sm:w-56 h-56 bg-gradient-to-br from-green-50 via-white to-green-50 border-3 border-dashed border-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 hover:border-green-500 transition-all mx-auto lg:mx-0 shadow-inner group-hover:shadow-lg">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Barangay logo"
                    className="w-full h-full object-contain p-4 sm:p-6"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Building className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                    </div>
                    <span className="text-gray-500 text-xs sm:text-sm font-bold block">
                      No Logo Uploaded
                    </span>
                    <span className="text-gray-400 text-xs block mt-1">
                      Click below to upload
                    </span>
                  </div>
                )}
              </div>
              {logoPreview && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                  ✓ Uploaded
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:gap-4 flex-1 w-full">
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
                className={`inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl cursor-pointer hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg w-full lg:w-auto min-h-[44px] ${
                  isUploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploadingLogo ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm sm:text-base">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </>
                )}
              </label>
              <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Upload Requirements
                </p>
                <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Recommended size: 200x200px or larger</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Maximum file size: 2MB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Supported formats: JPG, PNG, GIF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Use transparent background for best results</span>
                  </li>
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
