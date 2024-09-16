import React, { useState, useEffect } from 'react';

const WatchlistNotes = () => {
  const [notes, setNotes] = useState('');

  // Load notes from local storage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes') || '';
    setNotes(savedNotes);
  }, []);

  // Save notes to local storage
  const saveNotes = () => {
    localStorage.setItem('notes', notes);
    alert('Notes saved!');
  };

  return (
    <div className="watchlist-notes-container">
      <div className="watchlist-container">
        {}
      </div>

      <div className="notes-container">
        <h3>My Notes</h3>
        <textarea
          placeholder="Add your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      
      {}
      <button className="save-notes" onClick={saveNotes}>
        Save Notes
      </button>
    </div>
  );
};

export default WatchlistNotes;
