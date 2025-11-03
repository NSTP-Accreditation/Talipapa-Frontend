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
  const { success, error: showError } = useToast();

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
          setExcelPassword('BarangayTalipapa2025');
        }
      } catch (err: any) {
        showError(err?.message || 'Failed to fetch Excel password', {
          title: 'Error',
        });
        setExcelPassword('BarangayTalipapa2025');
      } finally {
        setLoadingPassword(false);
      }
    };

    fetchExcelPassword();
  }, [authFetch]);

  const handlePasswordSave = async () => {
    if (!excelPassword.trim()) {
      showError('Excel protection password cannot be empty', {
        title: 'Validation Error',
      });
      return;
    }

    if (excelPassword.length < 6) {
      showError('Password must be at least 6 characters long', {
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
    } catch (err: any) {
      showError(err?.message || 'Failed to update Excel password', {
        title: 'Error',
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <Card className="shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 via-green-50/50 to-white border-b-2 border-green-100">
        <CardTitle className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
            <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="line-clamp-1">Excel Report Protection</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 ml-11 sm:ml-14">
          Set a password to protect exported Excel reports from editing
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-white to-gray-50">
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
        <div className="space-y-3 p-4 sm:p-5 bg-white rounded-xl border-2 border-gray-200 hover:border-green-300 transition-colors">
          <label className="flex items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
            <span className="text-green-600">•</span>
            Protection Password
            {!editingPassword && (
              <span className="text-xs font-normal text-gray-500">
                (Click change to update)
              </span>
            )}
          </label>
          {loadingPassword ? (
            <div className="flex items-center gap-2 text-gray-500 py-4">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm sm:text-base">Loading password...</span>
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
                      placeholder="Enter password (min 6 characters)"
                      minLength={6}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <button
                      onClick={handlePasswordSave}
                      disabled={isSavingPassword || excelPassword.length < 6}
                      className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {isSavingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                        setEditingPassword(false);
                        setShowPassword(false);
                      }}
                      disabled={isSavingPassword}
                      className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Cancel</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg flex items-center gap-2 sm:gap-3 min-h-[44px]">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-sm sm:text-base text-gray-700 font-mono tracking-wider">
                      {'•'.repeat(Math.min(excelPassword.length, 20))}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingPassword(true)}
                    className="sm:flex-shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                  >
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Change Password</span>
                    <span className="sm:hidden">Change</span>
                  </button>
                </>
              )}
            </div>
          )}

          {excelPassword.length > 0 &&
            excelPassword.length < 6 &&
            editingPassword && (
              <p className="text-xs sm:text-sm text-red-600 flex items-center gap-1.5 animate-pulse">
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Password must be at least 6 characters long
              </p>
            )}

          <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
            <span>
              Current password will be used for all newly exported Excel reports
            </span>
          </p>
        </div>

        {/* Usage Example */}
        <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-4 sm:p-5">
          <h4 className="text-sm sm:text-base font-bold text-green-900 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            How it works:
          </h4>
          <ul className="text-xs sm:text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">•</span>
              <span>
                All exported Excel reports are automatically protected with this
                password
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">•</span>
              <span>
                Users can view and print reports but cannot modify protected
                sheets
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">•</span>
              <span>
                To edit a protected sheet, users must enter this password in
                Excel
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">•</span>
              <span>Change this password anytime to update future exports</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExcelPasswordSection;
