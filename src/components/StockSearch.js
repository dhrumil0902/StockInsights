import React, { useState } from 'react';
import './../App.css';

const StockSearch = ({ onSearch }) => {
  // State for managing the input value
  const [inputValue, setInputValue] = useState(() => {
    return localStorage.getItem('selectedTicker') || '';
  });

  // Handle search submission (only update ticker when Enter or button is clicked)
  const handleSearch = (e) => {
    e.preventDefault();

    const uppercaseTicker = inputValue.trim().toUpperCase();

    if (uppercaseTicker.length > 5) {
      alert('Ticker must be 5 characters or less.');
      return;
    }
    if (/\d/.test(uppercaseTicker)) { 
      alert('Ticker must not contain numbers.');
      return;
    }

    localStorage.setItem('selectedTicker', uppercaseTicker);
    onSearch(uppercaseTicker);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="ticker"
          style={{ textTransform: 'uppercase' }}
        />
        <button type="submit">🔍</button>
      </form>
    </div>
  );
};

export default StockSearch;
