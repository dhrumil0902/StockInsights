import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockNews = ({ ticker }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const bingApiKey = process.env.REACT_APP_BING_API_KEY || '25cc9a76f7b947e4826067f2fa8c76ab';
        const response = await axios.get(
          `https://api.bing.microsoft.com/v7.0/news/search?q=${ticker}`, {
            headers: {
              'Ocp-Apim-Subscription-Key': bingApiKey,
            }
          }
        );

        setNews(response.data.value.slice(0, 6)); // Get the top 6 news articles
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    if (ticker) {
      fetchNews();
    }

    return () => {
      setNews([]);
    };
  }, [ticker]);

  return (
    <div style={styles.newsWrapper}>
      {ticker && <h3 style={{ textAlign: 'center', justifyContent: "center" }}>Latest News</h3>}
      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <p>{error}</p>
      ) : news.length > 0 ? (
        <div style={styles.newsContainer}>
          {news.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.newsBox}
            >
              <div style={styles.newsContent}>
                <h4 style={styles.newsTitle}>{article.name}</h4>
                <p style={styles.newsDescription}>{article.description}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <p>No news available for {ticker}.</p>
      )}
    </div>
  );
};

// Basic styling for the news layout with scroll
const styles = {
  newsWrapper: {
    textAlign: 'center',
  },
  newsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '500px', // Set the maximum height of the news container
    overflowY: 'auto', // Enable vertical scroll when content exceeds height
    padding: '10px', // Optional padding
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  newsBox: {
    display: 'block',
    textDecoration: 'none',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
  },
  newsContent: {
    color: '#333',
  },
  newsTitle: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    color: '#0077cc',
  },
  newsDescription: {
    fontSize: '14px',
    margin: 0,
  },
};

export default StockNews;
