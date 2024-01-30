import React, { useState, useEffect, Suspense } from 'react';
import StockChart from './components/StockChart';
import Watchlist from './components/Watchlist';
import './App.css'; // Add some global styles

// Lazy load components
const StockNews = React.lazy(() => import('./components/StockNews'));
const RedditThreads = React.lazy(() => import('./components/RedditThreads'));

const App = () => {
  // State to manage the actual ticker used in search
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || 'TSLA'; // Default to 'TSLA'
  });

  // State to manage the input field value
  const [inputValue, setInputValue] = useState(ticker);

  useEffect(() => {
    const savedTicker = localStorage.getItem('selectedTicker');
    if (savedTicker) {
      setTicker(savedTicker);
      setInputValue(savedTicker); // Sync the input value with the saved ticker
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTicker', ticker);
  }, [ticker]);

  // Handle search submission (only update ticker on submission)
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTicker(inputValue.toUpperCase()); // Set ticker only when "Enter" is pressed or search is clicked
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Stock Dashboard for {ticker}</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={inputValue} // Bind the input value to inputValue state
            onChange={(e) => setInputValue(e.target.value.toUpperCase())} // Update input field as user types (uppercase)
            placeholder="Enter stock ticker"
            className="ticker-input"
            style={{ textTransform: 'uppercase' }} // Ensure the input shows uppercase
          />
          <button type="submit">🔍</button>
        </form>
      </header>

      <div className="dashboard">
        <div className="watchlist-container">
          <Watchlist onSelectTicker={setTicker} />
        </div>

        <div className="chart-container">
          <StockChart ticker={ticker} />
        </div>

        {/* Suspense for lazy-loaded components */}
        <Suspense fallback={<div>Loading Reddit threads...</div>}>
          <div className="reddit-threads-container">
            <RedditThreads ticker={ticker} />
          </div>
        </Suspense>

        <Suspense fallback={<div>Loading news...</div>}>
          <div className="news-container">
            <StockNews ticker={ticker} />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
