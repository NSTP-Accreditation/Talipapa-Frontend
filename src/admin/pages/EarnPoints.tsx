import React, { useMemo, useState, useEffect } from 'react';
import { Recycle, CheckCircle2 } from 'lucide-react';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useLoadingState } from '../../hooks/useLoadingState';
import { useToast } from '@/hooks/useToast';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';
import useFetchData from '../hooks/useFetchData';

export default function App() {
  const { isLoading: pageLoading } = useLoadingState(1000);
  const { data: materialsData, loading, error } = useFetchData('/materials');

  const [recordIdRest, setRecordIdRest] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [weights, setWeights] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authFetch = useAuthFetch();
  const { success, error: toastError } = useToast();

  // Initialize weights when materialsData is loaded
  useEffect(() => {
    if (materialsData && materialsData.length > 0) {
      const initialWeights: { [key: string]: string } = {};
      materialsData.forEach((material) => {
        initialWeights[material._id] = '';
      });
      setWeights(initialWeights);
    }
  }, [materialsData]);

  function handleWeightChange(materialId: string, value: string) {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeights((prev) => ({
        ...prev,
        [materialId]: value,
      }));
    }
  }

  const totalPoints = useMemo(() => {
    if (!materialsData) return 0;

    return materialsData.reduce((total, material) => {
      const weight = parseFloat(weights[material._id]) || 0;
      return total + weight * material.pointsPerKg;
    }, 0);
  }, [weights, materialsData]);

  const materialsWithValue = useMemo((): string[] => {
    if (!materialsData) return [];

    return materialsData
      .filter((material) => {
        const weight = parseFloat(weights[material._id]) || 0;
        return weight > 0;
      })
      .map((material) => material.name);
  }, [weights, materialsData]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidWeight = materialsData?.some((material) => {
      const weight = parseFloat(weights[material._id]) || 0;
      return weight > 0;
    });

    if (!hasValidWeight) {
      toastError('Please enter at least one material weight greater than 0', {
        title: 'Validation Error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        points: totalPoints,
        materials: materialsWithValue,
        lastName,
      };

      const result = await authFetch(`/records/BT-${recordIdRest}`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
      });

      success(
        `${result.record_id} ${result.lastName} current point is ${result.currentPoints}`,
        { title: 'Success' }
      );

      // Reset form after success
      setRecordIdRest('');
      setLastName('');
      const resetWeights: { [key: string]: string } = {};
      materialsData?.forEach((material) => {
        resetWeights[material._id] = '';
      });
      setWeights(resetWeights);
    } catch (err) {
      console.error(err);
      toastError('Failed to update record. Please try again.', {
        title: 'Error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading skeleton while loading
  if (pageLoading || loading) {
    return <FormTablePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-white rounded-xl border-2 border-red-200 shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <div className="text-xl font-semibold mb-2">
              Error Loading Materials
            </div>
            <div className="text-sm text-gray-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!materialsData || materialsData.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-8 max-w-md">
          <div className="text-gray-600 text-center">
            <Recycle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <div className="text-xl font-semibold mb-2">No Materials Found</div>
            <div className="text-sm">Please add materials to get started.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 bg-gradient-to-br from-emerald-50 via-white to-green-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Recycle className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
            Earn Points
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Accumulate points for residents' recycling records
          </p>
        </div>
      </div>

      {/* Full width card form */}
      <form
        className="bg-white rounded-2xl border border-gray-200 shadow-lg p-4 sm:p-8 w-full max-w-5xl mx-auto"
        onSubmit={handleConfirm}
      >
        {/* Record Info */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Record Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="block group">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Record ID
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 select-none font-medium text-sm sm:text-base">
                  BT-
                </span>
                <input
                  type="text"
                  value={recordIdRest}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    const limited = digitsOnly.slice(0, 4);
                    setRecordIdRest(limited);
                  }}
                  className="w-full pl-10 sm:pl-12 pr-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                  placeholder="0001"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Format:{' '}
                <span className="font-medium text-gray-700">BT-0001</span> (4
                digits only)
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Last Name
              </label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </div>

        {/* Materials Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
            Materials & Weights
          </h2>

          {/* Table Headers */}
          <div className="hidden sm:grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 mb-3 px-2">
            <div className="col-span-5">Material</div>
            <div className="col-span-3">Weight (kg)</div>
            <div className="col-span-2">Points/kg</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Input Rows */}
          <div className="space-y-3">
            {materialsData.map((material) => {
              const weight = parseFloat(weights[material._id]) || 0;
              const subtotal = weight * material.pointsPerKg;

              return (
                <div
                  key={material._id}
                  className="bg-gradient-to-r from-green-50 to-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
                    <div className="sm:col-span-5">
                      <div className="font-semibold text-gray-800 text-sm sm:text-base">
                        {material.name}
                      </div>
                      <div className="text-xs text-gray-500 sm:hidden mt-1">
                        {material.pointsPerKg} points/kg
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={weights[material._id] || ''}
                          onChange={(e) =>
                            handleWeightChange(material._id, e.target.value)
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-sm sm:text-base"
                          placeholder="0.0"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm">
                          kg
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block sm:col-span-2 text-gray-600 text-sm">
                      {material.pointsPerKg}
                    </div>
                    <div className="sm:col-span-2 text-right">
                      <span className="text-green-700 font-semibold text-sm sm:text-base">
                        {subtotal > 0 ? subtotal.toFixed(2) : '0'} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t-2 border-gray-200 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base sm:text-lg font-semibold text-gray-700">
              Total Points:
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-green-600">
              {totalPoints.toFixed(2)}
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-6 sm:px-8 py-3 w-full sm:w-auto rounded-lg shadow-md hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? 'Processing...' : 'Confirm & Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
