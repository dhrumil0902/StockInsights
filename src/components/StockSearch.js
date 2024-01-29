import React, { useState } from 'react';

const StockSearch = ({ onSearch }) => {
  // State for the actual ticker (used for search)
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || '';
  });

  // State for managing the input value
  const [inputValue, setInputValue] = useState(ticker);

  // Handle search submission (only update ticker when Enter or button is clicked)
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form from submitting the traditional way
    if (inputValue.trim()) {
      const uppercaseTicker = inputValue.toUpperCase(); // Ensure ticker is in uppercase
      setTicker(uppercaseTicker); // Update the ticker state
      localStorage.setItem('selectedTicker', uppercaseTicker); // Save to localStorage
      onSearch(uppercaseTicker); // Trigger the search with the entered ticker
    }
  };

  // Handle input change but don't update the ticker yet
  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase()); // Update only the input value (not the ticker)
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={inputValue} // Bind input to inputValue state
          onChange={handleInputChange} // Update inputValue on typing
          placeholder="Enter stock ticker"
          style={{ textTransform: 'uppercase' }} // Visually ensure uppercase
        />
        <button type="submit">🔍bv</button>
      </form>
    </div>
  );
};

export default StockSearch;
