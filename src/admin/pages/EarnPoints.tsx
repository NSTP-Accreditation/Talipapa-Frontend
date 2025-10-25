import React, { useMemo, useState, useEffect } from 'react';
import { Recycle } from 'lucide-react';
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
  const authFetch = useAuthFetch();
  const { success } = useToast();

  // Initialize weights when materialsData is loaded
  useEffect(() => {
    if (materialsData && materialsData.length > 0) {
      const initialWeights: { [key: string]: string } = {};
      materialsData.forEach((material) => {
        initialWeights[material._id] = '0';
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
      const { error } = useToast();
      error('Please enter at least one material weight greater than 0', {
        title: 'Validation',
      });
      return;
    }

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
    } catch (error) {
      console.log(error);
      const { error: toastError } = useToast();
      toastError('Failed to update record', { title: 'Error' });
    }
  };

  // Show loading skeleton while loading
  if (pageLoading || loading) {
    return <FormTablePageSkeleton />;
  }

  if (error) {
    return <div>Error loading materials: {error}</div>;
  }

  if (!materialsData || materialsData.length === 0) {
    return <div>No materials found</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <Recycle className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
            Earn Points
          </h1>
          <p className="text-sm sm:text-lg text-gray-700 mt-1 sm:mt-2 font-medium">
            Accumulate points of residents' record
          </p>
        </div>
        <div />
      </div>

      {/* Full width card form */}
      <form
        className="bg-white rounded-xl border-2 border-gray-200 shadow-md p-4 sm:p-8 w-full"
        onSubmit={handleConfirm}
      >
        {/* Record Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 w-full">
          <label className="block group">
            <label className="text-xs text-gray-500 mb-1 block">
              <span>Record ID</span>
            </label>
            <div className="relative">
              <label className="sr-only">Record ID</label>
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 select-none font-normal text-sm sm:text-base leading-6"
                style={{ fontWeight: 400 }}
              >
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
                className="w-full pl-10 sm:pl-12 px-3 py-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 font-normal text-sm sm:text-base leading-6"
                placeholder="0001"
                required
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Record ID will be stored as{' '}
              <span className="font-medium">BT-0001</span>. Only 4 digits
              allowed.
            </div>
          </label>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Last Name
            </label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-2 sm:gap-[23px] text-xs font-semibold text-gray-600 mb-2">
          <div className="col-span-6 text-xs sm:text-xs">Material</div>
          <div className="col-span-3 text-xs sm:text-xs">Weight</div>
          <div className="col-span-3 flex items-center justify-center text-xs sm:text-xs">
            Unit
          </div>
        </div>

        {/* Input Rows */}
        {materialsData.map((material) => (
          <div
            key={material._id}
            className="grid grid-cols-12 gap-2 sm:gap-[23px] items-center mb-2 sm:mb-3"
          >
            <div className="col-span-6">
              <div className="bg-gradient-to-r from-green-50 to-white px-2 sm:px-3 py-1.5 sm:py-2 rounded font-semibold text-gray-800 text-xs sm:text-base">
                {material.name}
              </div>
            </div>
            <div className="col-span-3">
              <input
                type="text"
                inputMode="decimal"
                value={weights[material._id] || '0'}
                onChange={(e) =>
                  handleWeightChange(material._id, e.target.value)
                }
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded bg-gray-50 text-xs sm:text-base"
                placeholder="0"
              />
            </div>
            <div className="col-span-3 text-gray-700 flex items-center justify-center text-xs sm:text-base">
              Kilogram
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <p className="text-base sm:text-lg font-semibold">Total Points:</p>
            <span className="text-emerald-700 ml-2 sm:ml-6 font-lg text-base sm:text-lg">
              {totalPoints}
            </span>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 sm:px-6 py-2 w-full sm:w-[220px] rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm sm:text-base"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
