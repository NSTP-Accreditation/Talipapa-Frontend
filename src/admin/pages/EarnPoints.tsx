import React, { useMemo, useState } from 'react';
import { Recycle } from 'lucide-react';
import { useAuthFetch } from '../hooks/useAuthFetch';
import { useLoadingState } from '../../hooks/useLoadingState';
import { FormTablePageSkeleton } from '../../components/LoadingSkeletons';

const MATERIALS = [
  'PET bottles',
  'Soft and hard plastics',
  'Candy and chichirya wrapper',
  'Plastic bags and food wrapping',
  'Food takeaway containers',
  'Water cooler bottles, baby cups, fiberglass',
  'Used cotton clothes',
];

export default function App() {
  // Add loading state with 1 second display
  const { isLoading: pageLoading } = useLoadingState(1000);

  // Store only the editable part (suffix) of the Record ID, fixed prefix is 'BT-'
  const [recordIdRest, setRecordIdRest] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [weights, setWeights] = useState<string[]>(MATERIALS.map(() => '0'));
  const authFetch = useAuthFetch();

  function handleWeightChange(index: number, value: string) {
    const newWeights = [...weights];
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      newWeights[index] = value;
      setWeights(newWeights);
    }
  }

  const totalPoints = useMemo(() => {
    return weights.reduce((total, weight) => {
      const numWeight = parseFloat(weight) || 0;
      return total + numWeight;
    }, 0);
  }, [weights]);

  const materialsWithValue = useMemo((): string[] => {
    return MATERIALS.filter((_, index) => {
      const weight = parseFloat(weights[index]) || 0;
      return weight > 0;
    });
  }, [weights]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidWeight = weights.some((weight) => {
      const numWeight = parseFloat(weight) || 0;
      return numWeight > 0;
    });

    if (!hasValidWeight) {
      alert('Please enter at least one material weight greater than 0');
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
      alert(
        `${result.record_id} ${result.lastName} current point is ${result.currentPoints}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Show loading skeleton while loading
  if (pageLoading) {
    return <FormTablePageSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Recycle className="w-10 h-10 text-green-600" />
            Earn Points
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">
            Accumulate points of residents' record
          </p>
        </div>
        <div />
      </div>

      {/* Full width card form */}
      <form
        className="bg-white rounded-xl border-2 border-gray-200 shadow-md p-8 w-full"
        onSubmit={handleConfirm}
      >
        {/* Record Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 w-full">
          <label className="block group">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <span>Record ID</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 font-bold">
                BT-
              </span>
              <input
                type="text"
                value={recordIdRest}
                onChange={(e) => {
                  // Allow digits only and limit to 4 digits
                  const digitsOnly = e.target.value.replace(/\D/g, '');
                  const limited = digitsOnly.slice(0, 4);
                  setRecordIdRest(limited);
                }}
                className="w-full pl-16 border-2 border-gray-300 rounded-xl px-4 py-3 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all outline-none text-gray-800 font-medium hover:border-gray-400"
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
              className="w-full px-3 py-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-[23px] text-xs font-semibold text-gray-600 mb-2">
          <div className="col-span-6">Material</div>
          <div className="col-span-3">Weight</div>
          <div className="col-span-3 flex items-center justify-center">
            Unit
          </div>
        </div>

        {/* Input Rows */}
        {MATERIALS.map((mat, idx) => (
          <div
            key={idx}
            className="grid grid-cols-12 gap-[23px] items-center mb-3"
          >
            <div className="col-span-6">
              <div className="bg-gradient-to-r from-green-50 to-white px-3 py-2 rounded font-semibold text-gray-800">
                {mat}
              </div>
            </div>
            <div className="col-span-3">
              <input
                type="text"
                inputMode="decimal"
                value={weights[idx]}
                onChange={(e) => handleWeightChange(idx, e.target.value)}
                className="w-full px-3 py-2 border rounded bg-gray-50"
                placeholder="0"
              />
            </div>
            <div className="col-span-3 text-gray-700 flex items-center justify-center">
              Kilogram
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold">Total Points:</p>
            <span className="text-emerald-700 ml-6 font-lg">{totalPoints}</span>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 w-full sm:w-[220px] rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
