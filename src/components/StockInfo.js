import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const StockChart = ({ ticker }) => {
  const [chartOptions, setChartOptions] = useState({});
  const [interval, setInterval] = useState('1day');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockInfo, setStockInfo] = useState({
    currentPrice: null,
    weekHigh: null,
    weekLow: null,
    marketCap: null,
    revenue: null,
    peRatio: null,
  });

  useEffect(() => {
    const fetchStockData = async () => {
      const apiKey = '8d801fb699msh6a9bf14462f343ap146256jsne219a0708264';
      try {
        const options = {
          method: 'POST',
          url: 'https://yahoo-finance160.p.rapidapi.com/info',
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'yahoo-finance160.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          data: { stock: ticker }
        };

        const response = await axios.request(options);
        const data = response.data;

        setStockInfo({
          currentPrice: data.currentPrice || 'N/A',
          weekHigh: data.fiftyTwoWeekHigh || 'N/A',
          weekLow: data.fiftyTwoWeekLow || 'N/A',
          marketCap: data.marketCap || 'N/A',
          revenue: data.totalRevenue || 'N/A',
          peRatio: data.trailingPE || 'N/A',
        });

        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Error fetching stock data. Make sure a valid ticker is provided.');
        setLoading(false);
      }
    };

    if (ticker) {
      fetchStockData();
    }
  }, [ticker]);

  return (
    <div className="chart-container">
      {loading ? (
        <p>Loading chart data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={chartOptions}
            containerProps={{ style: { height: '65%', width: '100%', flexGrow: 1 } }}
          />

          {/* Stock Info Section */}
          <div className="empty-space">
            <div className="stock-box">
              <h4>Current Price</h4>
              <p>${stockInfo.currentPrice}</p>
            </div>
            <div className="stock-box">
              <h4>52 Week High</h4>
              <p>${stockInfo.weekHigh}</p>
            </div>
            <div className="stock-box">
              <h4>52 Week Low</h4>
              <p>${stockInfo.weekLow}</p>
            </div>
            <div className="stock-box">
              <h4>Market Cap</h4>
              <p>${stockInfo.marketCap}</p>
            </div>
            <div className="stock-box">
              <h4>Revenue</h4>
              <p>${stockInfo.revenue}</p>
            </div>
            <div className="stock-box">
              <h4>P/E Ratio</h4>
              <p>{stockInfo.peRatio}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StockChart;
