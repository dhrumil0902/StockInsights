import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watchlist.css';

const API_KEY = '1fd5ef43b97e46cd891f06aeba1f0606';

const Watchlist = ({ onSelectTicker }) => {
  const [tickerInput, setTickerInput] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedWatchlist);

    if (savedWatchlist.length > 0) {
      savedWatchlist.forEach(ticker => {
        fetchStockPrice(ticker);
      });
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);

  // Fetch stock price for a ticker (current and previous day)
  const fetchStockPrice = async (ticker) => {
    try {
      const response = await axios.get(
        `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&outputsize=2&apikey=${API_KEY}`
      );
      const data = response.data.values;
      if (data && data.length >= 2) {
        const currentPrice = parseFloat(data[0].close); // Most recent close price
        const previousPrice = parseFloat(data[1].close); // Previous day's close price
        const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100; // Calculate percentage change

        setPrices((prevPrices) => ({
          ...prevPrices,
          [ticker]: { currentPrice, previousPrice, percentChange }, // Store prices and percentage change
        }));
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      setPrices((prevPrices) => ({
        ...prevPrices,
        [ticker]: null,
      }));
    }
  };

  const addTicker = () => {
    const upperTicker = tickerInput.toUpperCase();
    if (upperTicker && !watchlist.includes(upperTicker)) {
      setWatchlist((prevWatchlist) => [...prevWatchlist, upperTicker]);
      fetchStockPrice(upperTicker);
      setTickerInput('');
    }
  };

  const removeTicker = (ticker) => {
    const updatedWatchlist = watchlist.filter((item) => item !== ticker);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist)); 
    const updatedPrices = { ...prices };
    delete updatedPrices[ticker];
    setPrices(updatedPrices);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTicker();
    }
  };

  return (
    <div className="watchlist-container">
      <h3 style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>My Watchlist</h3>
      <div className="input-container">
        <input
          type="text"
          value={tickerInput}
          onChange={(e) => setTickerInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ticker"
        />
        <button className="add-to-watchlist" onClick={addTicker}>
          Add
        </button>
      </div>

      {}
      {watchlist.length > 0 ? (
        <div className="scrollable-ticker-container">
          <ul>
            {watchlist.map((ticker, index) => {
              const priceData = prices[ticker];
              let priceColor = 'black';
              if (priceData) {
                priceColor =
                  priceData.currentPrice > priceData.previousPrice ? 'green' : 'red';
              }

              return (
                <li
                  key={index}
                  className="watchlist-item"
                  onClick={() => onSelectTicker(ticker)}
                >
                  <span>{ticker}</span> {/* Adjust for space */}
                  <span
                    style={{
                      color: priceColor,
                      textAlign: 'center',
                    }}
                  >
                    {priceData ? `$${priceData.currentPrice.toFixed(2)}` : ''}
                  </span>
                  <span
                    style={{
                      color: priceData && priceData.percentChange !== undefined ? (priceData.percentChange > 0 ? 'green' : 'red') : 'black',
                      textAlign: 'center',
                    }}
                  >
                    {priceData && priceData.percentChange !== undefined ? `${priceData.percentChange.toFixed(2)}%` : ''}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTicker(ticker);
                    }}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p>Your watchlist is empty.</p>
      )}
    </div>
  );
};

export default Watchlist;
