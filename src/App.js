import React, { useState, useEffect, Suspense } from 'react';
import StockChart from './components/StockChart';
import Watchlist from './components/Watchlist';
import './App.css'; // Add some global styles

// Lazy load components
const StockNews = React.lazy(() => import('./components/StockNews'));
const RedditThreads = React.lazy(() => import('./components/RedditThreads'));

const App = () => {
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || 'TSLA'; // Default to 'TSLA'
  });
  
  const [inputTicker, setInputTicker] = useState(ticker); // Input state

  // Retrieve the ticker from localStorage when the app loads
  useEffect(() => {
    const savedTicker = localStorage.getItem('selectedTicker');
    if (savedTicker) {
      setTicker(savedTicker);
      setInputTicker(savedTicker); // Keep input synced
    }
  }, []);

  // Save the selected ticker to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTicker', ticker);
  }, [ticker]);

  // Handle input change
  const handleInputChange = (e) => {
    setInputTicker(e.target.value.toUpperCase()); // Keep the input uppercase
  };

  // Handle form submission (pressing Enter)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setTicker(inputTicker); // Set ticker to input value on Enter press
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Stock Dashboard for {ticker}</h1>
        <input
          type="text"
          value={inputTicker}
          onChange={handleInputChange} // Update the input state
          onKeyPress={handleKeyPress} // Trigger search on Enter press
          placeholder="Enter ticker"
          className="ticker-input"
          style={{ textTransform: 'uppercase' }}
        />
      </header>

      <div className="dashboard">
        <div className="watchlist-container">
          <Watchlist onSelectTicker={setTicker} />
        </div>

        <div className="chart-container">
          <StockChart ticker={ticker} /> {/* Fetch chart data only when ticker is set */}
        </div>

        <Suspense fallback={<div>Loading Reddit threads...</div>}>
          <div className="reddit-threads-container">
            <RedditThreads ticker={ticker} /> {/* Fetch Reddit data only when ticker is set */}
          </div>
        </Suspense>

        <Suspense fallback={<div>Loading news...</div>}>
          <div className="news-container">
            <StockNews ticker={ticker} /> {/* Fetch news only when ticker is set */}
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
