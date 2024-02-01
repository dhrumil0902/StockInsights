import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watchlist.css'; // Import the CSS file

const API_KEY = '1fd5ef43b97e46cd891f06aeba1f0606'; // Replace with your Twelve Data API key

const Watchlist = ({ onSelectTicker }) => {
  const [tickerInput, setTickerInput] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({}); // Store current and previous day prices

  // Load watchlist from localStorage when the component mounts
  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    setWatchlist(savedWatchlist);

    // Fetch stock prices for all tickers in the watchlist
    if (savedWatchlist.length > 0) {
      savedWatchlist.forEach(ticker => {
        fetchStockPrice(ticker); // Fetch stock prices for each saved ticker
      });
    }
  }, []); // Empty dependency array to run this only on component mount

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
        setPrices((prevPrices) => ({
          ...prevPrices,
          [ticker]: { currentPrice, previousPrice }, // Store both prices
        }));
      } else {
        throw new Error('No data found');
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      setPrices((prevPrices) => ({
        ...prevPrices,
        [ticker]: null, // Set null for ticker if an error occurs
      }));
    }
  };

  // Add a stock to the watchlist and fetch its price
  const addTicker = () => {
    const upperTicker = tickerInput.toUpperCase();
    if (upperTicker && !watchlist.includes(upperTicker)) {
      setWatchlist((prevWatchlist) => [...prevWatchlist, upperTicker]); // Add to watchlist
      fetchStockPrice(upperTicker); // Fetch price only for the added ticker
      setTickerInput(''); // Clear input after adding
    }
  };

  // Remove a stock from the watchlist
  const removeTicker = (ticker) => {
    const updatedWatchlist = watchlist.filter((item) => item !== ticker);
    setWatchlist(updatedWatchlist); // Update the state
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist)); // Save updated list to localStorage
    const updatedPrices = { ...prices };
    delete updatedPrices[ticker];
    setPrices(updatedPrices); // Remove the price when the ticker is removed
  };

  // Handle pressing Enter to add the ticker
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
          onKeyPress={handleKeyPress} // Add the stock when Enter is pressed
          placeholder="Enter stock ticker"
        />
        <button className="add-to-watchlist" onClick={addTicker}>
          Add
        </button>
      </div>

      {/* Scrollable container for tickers */}
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
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid #eee', // Border between items
                  }}
                >
                  <span>{ticker}</span>
                  <span
                    style={{
                      marginLeft: 'auto',
                      marginRight: '10px',
                      color: priceData ? priceColor : 'black',
                    }}
                  >
                    {priceData
                      ? `$${priceData.currentPrice.toFixed(2)}`
                      : 'Not Found'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTicker(ticker);
                    }}
                    style={{
                      backgroundColor: '#f41a1a',
                      border: 'none',
                      padding: '5px',
                      borderRadius: '3px',
                      color: 'white',
                      cursor: 'pointer',
                    }}
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
