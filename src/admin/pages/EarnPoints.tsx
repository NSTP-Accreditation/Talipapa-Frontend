import React, { useState } from "react";

const MATERIALS = [
  "PET bottles",
  "Soft and hard plastics",
  "Candy and chichirya wrapper",
  "Plastic bags and food wrapping",
  "Food takeaway containers",
  "Water cooler bottles, baby cups, fiberglass",
  "Used cotton clothes",
];

export default function EarnPointsPage() {
  const [recordId, setRecordId] = useState("");
  const [lastName, setLastName] = useState("");
  const [weights, setWeights] = useState(MATERIALS.map(() => 0));

  function handleWeightChange(index, value) {
    const newWeights = [...weights];
    newWeights[index] = Number(value) || 0;
    setWeights(newWeights);
  }

  const totalPoints = weights.reduce((a, b) => a + b, 0);

  function handleConfirm(e) {
    e.preventDefault();
    alert(`Saved!\n${recordId} ${lastName}\nTotal Points: ${totalPoints}`);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">♻️</span>
            Earn Points
          </h1>
          <p className="text-lg text-gray-700 mt-2 font-medium">Accumulate points of residents' record</p>
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
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Record ID</label>
            <input
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Record ID"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
            <input
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
          <div className="col-span-3 flex items-center justify-center">Unit</div>
        </div>

        {/* Input Rows */}
        {MATERIALS.map((mat, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-[23px] items-center mb-3">
            <div className="col-span-6">
              <div className="bg-gradient-to-r from-green-50 to-white px-3 py-2 rounded font-semibold text-gray-800">{mat}</div>
            </div>
              <div className="col-span-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={weights[idx]}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="w-full px-3 py-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            <div className="col-span-3 text-gray-700 flex items-center justify-center">Kilogram</div>
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 w-full sm:w-[220px] rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
}
