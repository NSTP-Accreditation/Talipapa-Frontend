import React, { useEffect, useState } from 'react';
import { Save, SquarePen } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import { useAuthFetch } from '../hooks/useAuthFetch';

interface Official {
  _id: string;
  name: string;
  position: string;
}

export default function OfficialsPanel() {
  const { data, loading, error, refetch } =
    useFetchData<Official[]>('/officials');
  const [isEditing, setIsEditing] = useState(false);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [originalOfficials, setOriginalOfficials] = useState<Official[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const authFetch = useAuthFetch();

  useEffect(() => {
    if (Array.isArray(data)) setOfficials(data);
  }, [data]);

  // keep a copy of original fetched officials to allow cancel
  useEffect(() => {
    if (Array.isArray(data)) setOriginalOfficials(data.map((d) => ({ ...d })));
  }, [data]);

  if (loading) return <FormTablePageSkeleton />;

  if (error)
    return (
      <div className="p-6">
        <h3 className="text-lg font-bold text-red-700">
          Failed to load officials
        </h3>
        <p className="text-sm text-gray-600 mt-2">{error}</p>
        <div className="mt-3">
          <button
            onClick={() => refetch()}
            className="px-3 py-2 bg-green-600 text-white rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );

  const handleChange = (
    index: number,
    key: 'name' | 'position',
    value: string
  ) => {
    setOfficials((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value };
      return copy;
    });
  };

  const handleSaveOfficials = async () => {
    setIsSaving(true);
    try {
      await authFetch(`${import.meta.env.VITE_API_URL}/officials/bulk-update`, {
        method: 'PUT',
        body: JSON.stringify(officials),
      });

      await refetch();
      setOriginalOfficials(officials.map((o) => ({ ...o })));
      setIsEditing(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save officials';
      alert('Save failed: ' + msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>👥</span>
            Barangay Officials
            <span className="ml-3 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {officials.length} Officials
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isEditing) {
                  // cancel edits
                  setOfficials(originalOfficials.map((o) => ({ ...o })));
                  setIsEditing(false);
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <SquarePen size={14} />
              {isEditing ? 'Cancel' : 'Edit'}
            </button>

            {isEditing && (
              <button
                onClick={handleSaveOfficials}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={14} />
                    Save
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officials.map((official, index) => (
            <div
              key={official._id}
              className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all duration-300 hover:shadow-md"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={official.name}
                    onChange={(e) =>
                      handleChange(index, 'name', e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={official.position}
                    onChange={(e) =>
                      handleChange(index, 'position', e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Position"
                  />
                </div>
              ) : (
                <div>
                  <p className="font-bold text-gray-900 text-base mb-1">
                    {official.name}
                  </p>
                  <p className="text-gray-600 text-sm">{official.position}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
