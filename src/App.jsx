import { useEffect, useState } from "react";
import "./App.css"; // 👈 Import styles

function App() {
  const [count, setCount] = useState(0);

  // Load initial count
  useEffect(() => {
    fetch("/api/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error(err));
  }, []);

  // Increment function
  const handleIncrement = () => {
    fetch("/api/increment", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch((err) => console.error(err));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">🪙 Coin Counter</h1>
      <p className="app-count">
        Current Count: <strong>{count}</strong>
      </p>
      <button className="app-button" onClick={handleIncrement}>
        ➕ Add Coin
      </button>
    </div>
  );
}

export default App;
