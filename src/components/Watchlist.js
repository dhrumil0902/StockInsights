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
  }, []); // Empty dependency array to run this only on component mount

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]); // Watch for changes in the watchlist

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
        throw new Error("No data found");
      }
    } catch (error) {
      console.error('Error fetching stock price:', error);
      setPrices((prevPrices) => ({
        ...prevPrices,
        [ticker]: null, // Set null for ticker if an error occurs
      }));
    }
  };

  // Fetch stock prices for all tickers in the watchlist
  useEffect(() => {
    watchlist.forEach((ticker) => {
      fetchStockPrice(ticker);
    });
  }, [watchlist]);

  // Add a stock to the watchlist
  const addTicker = () => {
    if (tickerInput && !watchlist.includes(tickerInput.toUpperCase())) {
      setWatchlist([...watchlist, tickerInput.toUpperCase()]);
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

  return (
<div className="watchlist-container">
  <h3>My Watchlist</h3>
  <div className="input-container">
    <input
      type="text"
      value={tickerInput}
      onChange={(e) => setTickerInput(e.target.value)}
      placeholder="Enter stock ticker"
    />
    <button className="add-to-watchlist" onClick={addTicker}>Add</button>
  </div>

  {watchlist.length > 0 ? (
    <ul>
      {watchlist.map((ticker, index) => {
        const priceData = prices[ticker];
        let priceColor = 'black';
        if (priceData) {
          priceColor = priceData.currentPrice > priceData.previousPrice ? 'green' : 'red';
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
              {priceData ? `$${priceData.currentPrice.toFixed(2)}` : 'Not Found'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTicker(ticker);
              }}
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  ) : (
    <p>Your watchlist is empty.</p>
  )}
</div>



  );
};

export default Watchlist;
