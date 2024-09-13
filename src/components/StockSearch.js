import React, { useState } from 'react';

const StockSearch = ({ onSearch }) => {
  // Load the ticker from localStorage or set to an empty string
  const [ticker, setTicker] = useState(() => {
    return localStorage.getItem('selectedTicker') || '';
  });

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (ticker.trim()) {  // Ensure ticker is not an empty string or only whitespace
      // Save the ticker to localStorage when searched
      localStorage.setItem('selectedTicker', ticker);
      onSearch(ticker); // Trigger search with the entered ticker
    }
  };

  // Handle input change and capitalize the ticker
  const handleInputChange = (e) => {
    const uppercaseTicker = e.target.value.toUpperCase(); // Convert to uppercase
    setTicker(uppercaseTicker); // Set the state with the uppercase value
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={ticker}
          onChange={handleInputChange} // Use the handleInputChange function
          placeholder="Enter ticker"
          style={{ textTransform: 'uppercase' }} // Force visual uppercase
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default StockSearch;
