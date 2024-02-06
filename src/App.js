import React, { useState, useEffect, Suspense } from 'react';
import StockChart from './components/StockChart';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';  // Import Portfolio component
import './App.css';

const StockNews = React.lazy(() => import('./components/StockNews'));
const RedditThreads = React.lazy(() => import('./components/RedditThreads'));

const App = () => {
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || 'TSLA'; // Default to 'TSLA'
  });

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setTicker(inputValue.toUpperCase());
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Stock Insights</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toUpperCase())}
            placeholder="Enter stock ticker"
            className="ticker-input"
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

        <div className="portfolio-container">
          <Portfolio onSelectTicker={setTicker} /> {/* Pass the setTicker function here */}
        </div>

        <Suspense fallback={<div>Loading news...</div>}>
          <div className="news-container">
            <StockNews ticker={ticker} />
          </div>
        </Suspense>

        <Suspense fallback={<div>Loading Reddit threads...</div>}>
          <div className="reddit-threads-container">
            <RedditThreads ticker={ticker} />
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
