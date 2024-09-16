import React, { useState, useEffect, Suspense } from 'react';
import StockChart from './components/StockChart';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import './App.css';

const StockNews = React.lazy(() => import('./components/StockNews'));
const RedditThreads = React.lazy(() => import('./components/RedditThreads'));

const App = () => {
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || 'TSLA'; // Default to 'TSLA'
  });

  const [inputValue, setInputValue] = useState(ticker);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedTicker = localStorage.getItem('selectedTicker');
    const savedNotes = localStorage.getItem('notes') || '';
    if (savedTicker) {
      setTicker(savedTicker);
      setInputValue(savedTicker); // Sync the input value with the saved ticker
    }
    setNotes(savedNotes); // Load saved notes from localStorage
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTicker', ticker);
  }, [ticker]);

  const saveNotes = () => {
    localStorage.setItem('notes', notes);
    alert('Notes saved!');
  };

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
            placeholder="Ticker"
            className="ticker-input"
          />
          <button type="submit">🔍</button>
        </form>
      </header>

      <div className="dashboard">
        <div className="portfolio-container">
          <Portfolio onSelectTicker={setTicker} /> {}
        </div>

        <div className="watchlist-container">
          <Watchlist onSelectTicker={setTicker} />
        </div>

        <div className="chart-container">
          <StockChart ticker={ticker} />
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

        {}
        <div className="notes-container">
          <h3>My Notes</h3>
          <textarea
            placeholder="Add your notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button className="save-notes" onClick={saveNotes}>
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
