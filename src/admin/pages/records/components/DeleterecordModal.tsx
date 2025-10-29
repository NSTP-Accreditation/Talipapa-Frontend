import { createPortal } from 'react-dom';
import { RecordInterface } from '@/types/global.types';
import { Dispatch, SetStateAction, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useAuthFetch } from '@/admin/hooks/useAuthFetch';
import { useToast } from '@/hooks/useToast';

type DeleterecordModalType = {
  deleteRecord: RecordInterface | null;
  setDeleteRecord: Dispatch<SetStateAction<RecordInterface | null>>;
  refetchRecords: (fetchUrl?: string) => Promise<RecordInterface[]>;
};

const DeleterecordModal = ({
  deleteRecord,
  setDeleteRecord,
  refetchRecords,
}: DeleterecordModalType) => {
  const authFetch = useAuthFetch();
  const { success, error: showError } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteResident = async () => {
    if (isDeleting || !deleteRecord) {
      return;
    }

    setIsDeleting(true);

    try {
      await authFetch(`/records/${deleteRecord._id}`, {
        method: 'DELETE',
      });

      refetchRecords();
      setDeleteRecord(null);
      success(`Record Deleted! ID: ${deleteRecord._id}`, {
        title: 'Record Deleted',
      });
    } catch (error) {
      console.log(error);
      showError('Failed to delete record.', { title: 'Error' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!deleteRecord) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1003] flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) setDeleteRecord(null);
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 shadow-lg">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-2xl font-bold text-white">
                  Delete Resident
                </h3>
                <p className="text-red-100 text-xs sm:text-sm font-medium">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDeleteRecord(null)}
              className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all hover:rotate-90 duration-300 ring-1 ring-white/30"
              title="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-white">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-gray-800 font-medium">
              Are you sure you want to delete the record for{' '}
              <span className="font-bold text-red-700">
                {deleteRecord.firstName} {deleteRecord.lastName}
              </span>
              ?
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Record ID:{' '}
              <span className="font-semibold">{deleteRecord._id}</span>
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                <span className="font-bold">Warning:</span> This will
                permanently delete all data associated with this resident. This
                action cannot be reversed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 sm:gap-3 p-4 sm:p-6 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <button
            type="button"
            onClick={() => setDeleteRecord(null)}
            disabled={isDeleting}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteResident}
            disabled={isDeleting}
            className="px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm sm:text-base"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleterecordModal;
