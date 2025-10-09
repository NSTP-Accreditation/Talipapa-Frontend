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
    console.log({ recordId, lastName, weights, totalPoints });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-[100px] flex flex-col items-center">

      {/* Form Container */}
      <form
        className="bg-white border border-gray-300 rounded shadow p-8 w-full max-w-4xl"
        onSubmit={handleConfirm}
      >
        {/* Form Title */}
        <h2 className="text-2xl font-bold text-emerald-800 mb-1">
          Earn Points
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Accumulate points of residents' record
        </p>

        {/* Record ID and Last Name */}
        <div className="mb-6">
          <label className="block text-xs text-gray-500 mb-1">Record ID</label>
          <input
            value={recordId}
            onChange={(e) => setRecordId(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-gray-100"
            placeholder="Record ID"
          />

          <label className="block text-xs text-gray-500 mt-4 mb-1">
            Last Name
          </label>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-gray-100"
            placeholder="Last Name"
          />
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 mb-2">
          <div className="col-span-6">Material</div>
          <div className="col-span-3 ml-[10px]">Weight</div>
          <div className="col-span-3 ml-[10px]">Unit</div>
        </div>

        {/* Rows */}
        {MATERIALS.map((mat, idx) => (
          <div
            key={mat}
            className="grid grid-cols-12 gap-[20px] items-center mb-3"
          >
            <div className="col-span-6">
              <div className="text-sm bg-green-400 text-white p-2 rounded">{mat}</div>
            </div>

            <div className="col-span-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={weights[idx]}
                onChange={(e) => handleWeightChange(idx, e.target.value)}
                className="w-[330px] px-3 py-2 border rounded bg-gray-50"
              />
            </div>

            <div className="col-span-3 text-right text-gray-600">
              Kilogram
            </div>
          </div>
        ))}
        
        {/* Footer: Total Points */}
        <div className="flex items-center gap-2 mt-6 text-sm font-semibold">
          <span>Total Points:</span>
          <span className="text-emerald-700">{totalPoints}</span>
        </div>

        {/* Confirm Button */}
        <div className="text-center mt-4"> 
          <button type="submit" className="px-4 py-1 bg-green-400 text-white rounded text-sm flex justify-center"> 
          Confirm </button> 
        </div>
      </form>
    </div>
  );
}
