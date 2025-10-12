import React, { useMemo, useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";

const MATERIALS = [
  "PET bottles",
  "Soft and hard plastics",
  "Candy and chichirya wrapper",
  "Plastic bags and food wrapping",
  "Food takeaway containers",
  "Water cooler bottles, baby cups, fiberglass",
  "Used cotton clothes",
];

export default function App() {
  const [recordId, setRecordId] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [weights, setWeights] = useState<string[]>(MATERIALS.map(() => "0"));
  const authFetch = useAuthFetch();

  function handleWeightChange(index: number, value: string) {
    const newWeights = [...weights];
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
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
    
    try {

      const requestBody = {
        points: totalPoints,
        materials: materialsWithValue,
        lastName
      };

      const result = await authFetch(`/records/${recordId}`, {
        method: "PATCH",
        body: JSON.stringify(requestBody)
      });
      alert(`${result.record_id} ${result._lastName} current point is ${result.currentPoints}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-0 m-0">
      {/* ✅ FULL WIDTH FORM */}
      <form
        className="bg-white border border-gray-300 rounded-none shadow p-8 w-full"
        onSubmit={handleConfirm}
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-emerald-800 mb-1">Earn Points</h2>
        <p className="text-sm text-gray-600 mb-6">
          Accumulate points of residents' record
        </p>

        {/* Record Info */}
        <div className="grid grid-cols-2 gap-6 mb-6 w-full">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Record ID</label>
            <input
              required
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100"
              placeholder="Record ID"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100"
              placeholder="Last Name"
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-[23px] text-xs font-semibold text-gray-600 mb-2">
          <div className="col-span-6">Material</div>
          <div className="col-span-3">Weight</div>
          <div className="col-span-3 flex items-center justify-center">Unit</div>
        </div>

        {/* Input Rows */}
        {MATERIALS.map((mat, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-[23px] items-center mb-3">
            <div className="col-span-6">
              <div className="bg-green-700 text-white px-3 py-2 rounded">{mat}</div>
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
            <div className="col-span-3 text-gray-700 flex items-center justify-center">Kilogram</div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-lg font-semibold">
            Total Points:
          </p>
          <span className="text-emerald-700 ml-[210px] font-lg">{totalPoints}</span>
          <button
            type="submit"
            className="bg-green-700 text-white px-6 py-2 w-[250px] rounded hover:bg-green-800"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}