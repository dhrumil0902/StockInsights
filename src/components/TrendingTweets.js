import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrendingTweets = ({ ticker }) => {
  const [tweets, setTweets] = useState([]);

  // Fetch trending tweets related to the stock ticker
  useEffect(() => {
    const fetchTweets = async () => {
      const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAJ9xvwEAAAAAWcw4id92FrV%2B3M2bp19jK01H7ME%3DaP5JZAsHWw04615YHM61Tx5ZweYbobNZVZ6TviYOCX2reA55Lq'; // Add your Bearer token here
      const headers = {
        Authorization: `Bearer ${bearerToken}`,
      };
  
      try {
        
        const response = await axios.get(
          `"https://api.twitter.com/2/tweets/search/recent?query=%24PLTR&tweet.fields=public_metrics&expansions=author_id`,
          { headers }
        );
  
        const sortedTweets = response.data.data.sort(
          (a, b) => b.public_metrics.retweet_count - a.public_metrics.retweet_count
        );
        setTweets(sortedTweets); // Set the sorted tweets in state
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };
  
    if (ticker) {
      fetchTweets();
    }
  }, [ticker]);
  
  return (
    <div className="tweets-container">
      <h3>Trending Tweets for {ticker}</h3>
      {tweets.length > 0 ? (
        <ul>
          {tweets.map((tweet) => (
            <li key={tweet.id} className="tweet-item">
              <p>{tweet.text}</p>
              <p>Retweets: {tweet.public_metrics.retweet_count} | Likes: {tweet.public_metrics.like_count}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No trending tweets found for {ticker}</p>
      )}
    </div>
  );
};

export default TrendingTweets;
