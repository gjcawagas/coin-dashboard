import { useState, useEffect } from "react";
import { Coins, RotateCcw, Sparkles } from "lucide-react";
import './App.css';

export default function App() {
  const [coinCount, setCoinCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch coins from backend
  const fetchCoins = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/data", { cache: "no-store" });
      const data = await res.json();
      setCoinCount(data.total || 0);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add coins with animation
  const addCoins = async () => {
    if (!inputValue || isNaN(inputValue) || parseFloat(inputValue) <= 0) {
      setError("Please enter a valid positive number");
      return;
    }

    setIsLoading(true);
    setError("");
    setIsAnimating(true);

    try {
      const amount = parseFloat(inputValue);
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinCount: amount }),
      });

      if (res.ok) {
        const data = await res.json();
        setCoinCount(data.total);
        setHistory(prev => [
          { action: `Added ${amount} coins`, timestamp: new Date(), amount },
          ...prev.slice(0, 4)
        ]);
        setInputValue("");
      } else {
        setError("Failed to add coins");
      }
    } catch (err) {
      setError("Error adding coins");
      console.error("Add coins error:", err);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Reset coins
  const resetCoins = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/data", { method: "DELETE" });
      if (res.ok) {
        setCoinCount(0);
        setHistory(prev => [
          { action: "Reset all coins", timestamp: new Date(), amount: 0 },
          ...prev.slice(0, 4)
        ]);
      } else {
        setError("Failed to reset coins");
      }
    } catch (err) {
      setError("Error resetting coins");
      console.error("Reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchCoins();
  }, []);

  // Handle input key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addCoins();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-transparent to-orange-600/20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Coins className="w-8 h-8 text-white mr-2" />
                <h1 className="text-2xl font-bold text-white">Coin Counter</h1>
                <Sparkles className="w-6 h-6 text-white ml-2" />
              </div>
              
              {/* Animated Coin Display */}
              <div className={`transition-all duration-500 ${isAnimating ? 'scale-110 rotate-12' : 'scale-100'}`}>
                {coinCount > 0 && (
                  <div className="text-7xl font-bold text-white mb-1">
                    {coinCount.toLocaleString()}
                  </div>
                )}
                <div className="text-white/90 text-sm font-medium">
                  Total Coins Collected
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm animate-pulse">
                {error}
              </div>
            )}

            {/* Add Coins Section */}
            <div className="space-y-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all duration-200 bg-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                onClick={resetCoins}
                disabled={isLoading}
                className="py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* History Section */}
            {history.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Recent Activity</h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50/70 rounded-lg text-sm"
                    >
                      <span className="text-gray-700">{item.action}</span>
                      <span className="text-gray-500 text-xs">
                        {item.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-4 text-center text-gray-600">
          <div className="text-sm">
            {isLoading ? "Processing..." : ""}
          </div>
        </div>
      </div>
    </div>
  );
}