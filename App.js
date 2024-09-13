import React, { useState } from 'react';
import StockDashboard from './components/StockDashboard';
import Watchlist from './components/Watchlist'; // Import Watchlist

const App = () => {
  const [selectedTicker, setSelectedTicker] = useState('AAPL'); // Default ticker

  // This function is passed to the Watchlist to handle when a user selects a ticker
  const handleSelectTicker = (ticker) => {
    setSelectedTicker(ticker);
  };

  return (
    <div style={styles.appContainer}>
      <h1>Stock Watchlist and Dashboard</h1>

      {/* Watchlist Section */}
      <div style={styles.sidebar}>
        <Watchlist onSelectTicker={handleSelectTicker} /> {/* Render Watchlist */}
      </div>

      {/* Stock Dashboard Section */}
      <div style={styles.dashboard}>
        <StockDashboard ticker={selectedTicker} /> {/* Pass selectedTicker to StockDashboard */}
      </div>
    </div>
  );
};

// Basic styles for the app layout
const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
  },
  sidebar: {
    width: '300px',
  },
  dashboard: {
    width: 'calc(100% - 320px)',
    marginLeft: '20px',
  },
};

export default App;
