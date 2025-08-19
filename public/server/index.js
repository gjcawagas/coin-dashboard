const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for coin counts
let coinCounts = {
  '1': 0,
  '5': 0,
  '10': 0,
  '25': 0
};

// API endpoint to get current coin counts
app.get('/api/coins', (req, res) => {
  res.json({ counts: coinCounts });
});

// API endpoint to increment a specific coin count
app.post('/api/coins/increment', (req, res) => {
  const { denomination } = req.body;
  if (coinCounts.hasOwnProperty(denomination)) {
    coinCounts[denomination]++;
    res.json({ success: true, counts: coinCounts });
  } else {
    res.status(400).json({ success: false, error: 'Invalid denomination' });
  }
});

// API endpoint to reset all counts
app.post('/api/coins/reset', (req, res) => {
  coinCounts = {
    '1': 0,
    '5': 0,
    '10': 0,
    '25': 0
  };
  res.json({ success: true, counts: coinCounts });
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});