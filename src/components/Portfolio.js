import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = '';

const Portfolio = ({ onSelectTicker }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [ticker, setTicker] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [currentPrices, setCurrentPrices] = useState({});

  // Load portfolio from local storage
  useEffect(() => {
    const savedPortfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
    setPortfolio(savedPortfolio);
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const addStock = () => {
    if (ticker.length > 5) {
        alert('Ticker length must be 5 characters or less.');
        return;
    }

    if (/\d/.test(ticker)) {
      alert('Ticker must not include numbers.');
      return;
    }

    if (ticker && price > 0 && quantity > 0) {
      const upperTicker = ticker.toUpperCase();
      const isTickerInPortfolio = portfolio.some(stock => stock.ticker === upperTicker);

      if (isTickerInPortfolio) {
        alert('This stock is already in your portfolio.');
        return;
      }

      const newStock = {
        ticker: upperTicker,
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
      };

      setPortfolio([...portfolio, newStock]);
      setTicker('');
      setPrice('');
      setQuantity('');
      fetchCurrentPrice(upperTicker); // Fetch current price for new stock
    } else {
      alert('Please enter valid ticker, price, and quantity.');
    }
  };

  const removeStock = (tickerToRemove) => {
    setPortfolio(portfolio.filter(stock => stock.ticker !== tickerToRemove));
    setCurrentPrices(prevPrices => {
      const newPrices = { ...prevPrices };
      delete newPrices[tickerToRemove];
      return newPrices;
    });
  };

  const editStock = (ticker) => {
    const stockToEdit = portfolio.find(stock => stock.ticker === ticker);
    setEditMode(ticker);
    setEditPrice(stockToEdit.price);
    setEditQuantity(stockToEdit.quantity);
  };

  const saveEditStock = (ticker) => {
    if (editPrice > 0 && editQuantity > 0) {
      const updatedPortfolio = portfolio.map(stock => {
        if (stock.ticker === ticker) {
          return { ...stock, price: parseFloat(editPrice), quantity: parseInt(editQuantity, 10) };
        }
        return stock;
      });
      setPortfolio(updatedPortfolio);
      setEditMode(null);
    } else {
      alert('Price and quantity must be greater than 0');
    }
  };

  const fetchCurrentPrice = async (ticker) => {
    try {
      const response = await axios.get(
        `https://api.example.com/stock/${ticker}/quote?apikey=${API_KEY}`
      );
      const currentPrice = response.data.price;
      setCurrentPrices(prevPrices => ({ ...prevPrices, [ticker]: currentPrice }));
    } catch (error) {
      console.error('Error fetching current price:', error);
    }
  };

  useEffect(() => {
    portfolio.forEach(stock => {
      fetchCurrentPrice(stock.ticker);
    });
  }, []);

  const totalPortfolioValue = portfolio.reduce(
    (acc, stock) => acc + stock.price * stock.quantity,
    0
  );

  // Calculate percentage change
  const calculateChange = (originalPrice, currentPrice) => {
    if (!currentPrice || !originalPrice) return null;
    return ((currentPrice - originalPrice) / originalPrice) * 100;
  };

  return (
    <div className="portfolio-container">
      <h3>My Portfolio - Total Value: ${totalPortfolioValue.toFixed(2)}</h3>
      <div className="input-container">
        <input
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Enter ticker"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter price"
          min="0"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
          min="0"
        />
        <button className="add-to-portfolio" onClick={addStock}>
          Add
        </button>
      </div>

      {portfolio.length > 0 ? (
        <div className="scrollable-portfolio-container">
          <table className="portfolio-table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Current Price</th>
                <th>Change (%)</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((stock, index) => (
                <tr key={index} onClick={() => onSelectTicker(stock.ticker)} style={{ cursor: 'pointer' }}>
                  <td>{stock.ticker}</td>
                  <td>
                    {editMode === stock.ticker ? (
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="edit-input-small"
                      />
                    ) : (
                      `$${stock.price.toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {editMode === stock.ticker ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) => setEditQuantity(e.target.value)}
                        className="edit-input-small"
                      />
                    ) : (
                      stock.quantity
                    )}
                  </td>
                  <td>
                    {currentPrices[stock.ticker]
                      ? `$${currentPrices[stock.ticker].toFixed(2)}`
                      : 'Loading...'}
                  </td>
                  <td>
                    {currentPrices[stock.ticker]
                      ? `${calculateChange(stock.price, currentPrices[stock.ticker]).toFixed(2)}%`
                      : 'N/A'}
                  </td>
                  <td>${(stock.price * stock.quantity).toFixed(2)}</td>
                  <td>
                    {editMode === stock.ticker ? (
                      <button onClick={(e) => { e.stopPropagation(); saveEditStock(stock.ticker); }} className="save-edit">
                        Save
                      </button>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); editStock(stock.ticker); }} className="edit-stock">
                        Edit
                      </button>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); removeStock(stock.ticker); }} className="remove-from-portfolio">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Your portfolio is empty.</p>
      )}
    </div>
  );
};

export default Portfolio;
