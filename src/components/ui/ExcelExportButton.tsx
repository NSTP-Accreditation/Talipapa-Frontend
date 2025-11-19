import React, { useState } from 'react';
import { Button } from '@/components/ui';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import {
  exportResidentRecords,
  exportNonResidentRecords,
  exportEstablishmentRecords,
  ResidentRecord,
  EstablishmentRecord,
  RecordType,
} from '@/utils/excelExport';

interface ExcelExportButtonProps {
  records: ResidentRecord[] | EstablishmentRecord[];
  recordType: RecordType;
  className?: string;
  buttonText?: string;
  buttonTextMobile?: string;
}

const ExcelExportButton: React.FC<ExcelExportButtonProps> = ({
  records,
  recordType,
  className = '',
  buttonText,
  buttonTextMobile,
}) => {
  const { error: showError, success: showSuccess } = useToast();
  const authFetch = useAuthFetch();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExport = async () => {
    if (!records || records.length === 0) {
      showError('No records available to export.', { title: 'Export' });
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      // Fetch Excel protection password from settings
      let password = 'BarangayTalipapa2025'; // Default fallback
      try {
        const settingsResponse = await authFetch(
          `/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`
        );
        if (settingsResponse?.excelProtectionPassword) {
          password = settingsResponse.excelProtectionPassword;
        }
      } catch (err: any) {
        // Silent fail - use default password
      }

      // Call appropriate export function based on record type
      const exportOptions = {
        password,
        showLoadingState: setIsExporting,
      };

      if (recordType === 'resident') {
        await exportResidentRecords(records as ResidentRecord[], exportOptions);
      } else if (recordType === 'non-resident') {
        await exportNonResidentRecords(
          records as ResidentRecord[],
          exportOptions
        );
      } else if (recordType === 'establishment') {
        await exportEstablishmentRecords(
          records as EstablishmentRecord[],
          exportOptions
        );
      }

      showSuccess(
        'Excel report exported successfully with protection enabled!',
        {
          title: 'Export Complete',
        }
      );

      // Show success state briefly
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error: any) {
      showError(
        error?.message || 'Failed to export Excel report. Please try again.',
        {
          title: 'Export Error',
        }
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Default button text based on record type
  const defaultButtonText = buttonText || 'Export Excel Report';
  const defaultButtonTextMobile = buttonTextMobile || 'Export Excel';

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || exportSuccess}
      className={`bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm sm:text-base flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-md hover:shadow-xl transition-all hover:scale-105 min-h-[44px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          <span className="hidden sm:inline">Exporting...</span>
          <span className="sm:hidden">Exporting...</span>
        </>
      ) : exportSuccess ? (
        <>
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-200" />
          <span className="hidden sm:inline">Exported!</span>
          <span className="sm:hidden">Exported!</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{defaultButtonText}</span>
          <span className="sm:hidden">{defaultButtonTextMobile}</span>
        </>
      )}
    </Button>
  );
};

export default ExcelExportButton;
