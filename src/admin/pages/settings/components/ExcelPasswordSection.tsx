import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Info,
  Lock,
  Pencil,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const ExcelPasswordSection = () => {
  const authFetch = useAuthFetch();
  const { success, error } = useToast();

  const [editingPassword, setEditingPassword] = useState<boolean>(false);
  const [isSavingPassword, setIsSavingPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [excelPassword, setExcelPassword] = useState<string>('');
  const [loadingPassword, setLoadingPassword] = useState<boolean>(true);

  // Fetch current password from settings
  useEffect(() => {
    const fetchExcelPassword = async () => {
      try {
        const response = await authFetch(
          `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
        );
        if (response?.excelProtectionPassword) {
          setExcelPassword(response.excelProtectionPassword);
        } else {
          // Default password if not set
          setExcelPassword('BarangayTalipapa2024');
        }
      } catch (err) {
        console.error('Failed to fetch Excel password:', err);
        setExcelPassword('BarangayTalipapa2024');
      } finally {
        setLoadingPassword(false);
      }
    };

    fetchExcelPassword();
  }, [authFetch]);

  const handlePasswordSave = async () => {
    if (!excelPassword.trim()) {
      error('Excel protection password cannot be empty', {
        title: 'Validation Error',
      });
      return;
    }

    if (excelPassword.length < 6) {
      error('Password must be at least 6 characters long', {
        title: 'Validation Error',
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await authFetch(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`, {
        method: 'PATCH',
        body: JSON.stringify({
          excelProtectionPassword: excelPassword,
        }),
      });
      success('Excel protection password updated successfully', {
        title: 'Success',
      });
      setEditingPassword(false);
      setShowPassword(false);
    } catch (err) {
      console.error(err);
      error('Failed to update Excel password', { title: 'Error' });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Card className="shadow-md border border-gray-200 overflow-hidden">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          Excel Report Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Information Alert */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                About Excel Report Protection
              </h4>
              <p className="text-xs sm:text-sm text-blue-800">
                This password is used to protect exported Excel reports, making
                them read-only. Users will need this password to edit the
                protected sheets. Set a strong password to maintain data
                integrity in official reports.
              </p>
            </div>
          </div>
        </div>

        {/* Password Setting */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-base font-semibold text-gray-700">
            <Lock className="w-4 h-4 text-gray-600" />
            Protection Password
          </label>
          {loadingPassword ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Loading password...
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {editingPassword ? (
                <>
                  <div className="flex-1 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={excelPassword}
                      onChange={(e) => setExcelPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                      placeholder="Enter password (min 6 characters)"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <button
                      onClick={handlePasswordSave}
                      disabled={isSavingPassword}
                      className="flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSavingPassword ? (
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
                      onClick={() => {
                        setEditingPassword(false);
                        setShowPassword(false);
                      }}
                      disabled={isSavingPassword}
                      className="flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-sm disabled:opacity-50 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm sm:text-base text-gray-700 font-mono">
                      {'•'.repeat(Math.min(excelPassword.length, 20))}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="sm:flex-shrink-0 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Pencil className="w-4 h-4" />
                    Change Password
                  </button>
                </>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Current password will be used for all newly exported Excel reports
          </p>
        </div>

        {/* Usage Example */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            How it works:
          </h4>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>
              All exported Excel reports are automatically protected with this
              password
            </li>
            <li>
              Users can view and print reports but cannot modify protected
              sheets
            </li>
            <li>
              To edit a protected sheet, users must enter this password in Excel
            </li>
            <li>Change this password anytime to update future exports</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelPasswordSection;
