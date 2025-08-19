import React, { useState } from "react";

const CoinCounter = () => {
  const [count, setCount] = useState(0);

  // Function to add coin (trigger this when coin slot detects a coin)
  const addCoin = () => {
    setCount(prev => prev + 1);
  };

  // Reset function
  const resetCounter = () => {
    setCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-2xl mb-6 flex items-center gap-2">
        <span className="text-3xl">💰</span> Coin Counter
      </h1>

      <div className="text-7xl font-bold text-blue-500 mb-6">{count}</div>

      <button
        onClick={resetCounter}
        className="bg-red-600 hover:bg-red-800 text-white font-bold py-3 px-8 rounded-2xl shadow-md"
      >
        Reset
      </button>

      {/* Test button (remove in production, only for demo) */}
      <button
        onClick={addCoin}
        className="mt-4 bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-2xl shadow-md"
      >
        Add Coin
      </button>
    </div>
  );
};

export default CoinCounter;
