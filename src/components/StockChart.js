import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-date-fns'; // Import the date adapter

const StockChart = ({ ticker }) => {
  const [chartData, setChartData] = useState({});
  const [interval, setInterval] = useState('1day'); // Default interval is daily
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = '1fd5ef43b97e46cd891f06aeba1f0606'; // Replace with your Twelve Data API key
      try {
        const response = await axios.get(
          `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&apikey=${apiKey}`
        );

        const data = response.data.values.reverse();
        const chartLabels = data.map(item => item.datetime);
        const chartPrices = data.map(item => parseFloat(item.close));

        setChartData({
          labels: chartLabels,
          datasets: [
            {
              label: `${ticker} Stock Price`,
              data: chartPrices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderWidth: 2,
            },
          ],
        });
        setError(false);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError(true);
        setLoading(false);
      }
    };

    if (ticker) {
      fetchStockData();
    }
  }, [ticker, interval]);

  return (
    <div>
      <h3>Stock Price for {ticker}</h3>
      {/* Add interval selector */}
      <select
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
        style={{ marginBottom: '10px' }}
      >
        <option value="5min">5 min</option>
        <option value="4h">4 hour</option>
        <option value="1day">Daily</option>
        <option value="1week">Weekly</option>
      </select>
      {loading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p>Error loading stock data.</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: true, // Disable fixed aspect ratio
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: interval === '5min' ? 'minute' : interval === '4h' ? 'hour' : 'day',
                },
              },
            },
          }}
          height={400} // Set a specific height
          width={600} // Set a specific width
        />
      )}
    </div>
  );
};

export default StockChart;
