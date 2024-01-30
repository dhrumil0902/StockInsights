import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import 'chartjs-adapter-date-fns'; // Import the date adapter

const StockChart = ({ ticker }) => {
  const [chartData, setChartData] = useState({});
  const [interval, setInterval] = useState('1day'); // Default interval is daily
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Store error message

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = '1fd5ef43b97e46cd891f06aeba1f0606'; // Replace with your Twelve Data API key
      try {
        const response = await axios.get(
          `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&outputsize=500&apikey=${apiKey}`
        );  // Increase outputsize to 500 for more historical data

        // Check if the API returned an error
        if (response.data.status === 'error') {
          throw new Error(response.data.message);
        }

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
              pointHoverRadius: 5, // Increase point size on hover
              pointHitRadius: 10, // Increase click area for points
            },
          ],
        });
        setError(null); // Clear any previous error
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        if (error.message.includes('You have run out of API')) {
          setError('Max API call limit reached, please try again in 1 minute!');
        }
        else {
          setError('Error fetching stock data. Make sure valid ticker is provided.');
        }
        setLoading(false);
      }
    };

    if (ticker) {
      fetchStockData();
    }
  }, [ticker, interval]);

  return (
    <div>
      <h3>Stock Graph</h3>
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
        <p>{error}</p>
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
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: function (context) {
                    const label = context.dataset.label || '';
                    const value = context.raw || 0;
                    return `${label}: $${value.toFixed(2)}`;
                  },
                },
              },
              zoom: {
                pan: {
                  enabled: true,
                  mode: 'xy',
                },
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true,
                  },
                  mode: 'xy',
                },
              },
            },
            interaction: {
              mode: 'nearest', // Display the nearest point tooltip
              axis: 'x',
              intersect: false, // Tooltip displays for the nearest point without intersecting
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
