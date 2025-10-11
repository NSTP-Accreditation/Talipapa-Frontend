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

export default function App() {
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
              value={recordId}
              onChange={(e) => setRecordId(e.target.value)}
              className="w-full px-3 py-2 border rounded bg-gray-100"
              placeholder="Record ID"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Last Name</label>
            <input
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
                  type="number"
                  min="0"
                  step="0.01"
                  value={weights[idx]}
                  onChange={(e) => handleWeightChange(idx, e.target.value)}
                  className="w-full px-3 py-2 border rounded bg-gray-50"
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
