import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RedditThreads.css'; // Import the CSS file

const clientId = '9mxvBGQC4eEXhU_MskU7BA'; // Your API key (client ID)
const clientSecret = 'GE0cQIbh15OqTvE4xuCy174PRGaq1A'; // Your client secret

// Function to get an access token from Reddit
const getAccessToken = async () => {
  const credentials = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
    return null;
  }
};

const RedditThreads = ({ ticker }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortMethod, setSortMethod] = useState('hot'); // Default to 'hot'

  useEffect(() => {
    const fetchRedditThreads = async () => {
      setLoading(true);
      setError(null);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        setError('Failed to get access token.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://oauth.reddit.com/r/stocks/search.json?q=${ticker}&sort=${sortMethod}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'User-Agent': 'MyRedditApp/0.1',
            },
          }
        );

        setThreads(response.data.data.children);
      } catch (error) {
        setError('Error fetching Reddit threads.');
        console.error('Error fetching Reddit threads:', error);
      }

      setLoading(false);
    };

    if (ticker) {
      fetchRedditThreads();
    }
  }, [ticker, sortMethod]);

  return (
    <div className="reddit-threads-container">
      <h3>
        <select
          value={sortMethod}
          onChange={(e) => setSortMethod(e.target.value)}
          className="reddit-sort-dropdown" // Added class for styling
        >
          <option value="hot">Hot</option>
          <option value="top">Most Upvoted</option>
          <option value="new">Most Recent</option>
        </select>
        &nbsp; {/* Added non-breaking space here */}
        Reddit Threads for {ticker}
      </h3>

      {loading && <p>Loading threads...</p>}
      {error && <p>{error}</p>}
      <ul>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <a
              href={`https://reddit.com${thread.data.permalink}`}
              target="_blank"
              rel="noreferrer"
              key={thread.data.id}
              style={{ textDecoration: 'none', color: 'inherit' }} // Remove underline and inherit color
            >
              <li
                style={{
                  cursor: 'pointer',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
              >
                <strong>{thread.data.title}</strong>
                <p>
                  Upvotes: {thread.data.ups} | Comments: {thread.data.num_comments}
                </p>
              </li>
            </a>
          ))
        ) : (
          !loading && <p>No Reddit threads found for {ticker}.</p>
        )}
      </ul>
    </div>
  );
};

export default RedditThreads;
