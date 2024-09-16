import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const StockChart = ({ ticker }) => {
  const [chartOptions, setChartOptions] = useState(null);
  const [interval, setInterval] = useState('1day');
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [chartError, setChartError] = useState(false);
  const [infoError, setInfoError] = useState(false);
  const [stockInfo, setStockInfo] = useState({
    currentPrice: null,
    weekHigh: null,
    weekLow: null,
    percent_change: null,
    volume: null,
    average_volume: null,
  });

  // Fetch chart data from Twelve Data API
  useEffect(() => {
    const fetchChartData = async () => {
      const apiKey = '1fd5ef43b97e46cd891f06aeba1f0606';

      try {
        // Request for stock price data with dynamic interval
        const stockPriceResponse = await axios.get(
          `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&outputsize=500&apikey=${apiKey}`
        );

        const stockPriceData = stockPriceResponse.data.values.reverse();

        const chartData = stockPriceData.map((data) => [
          new Date(data.datetime).getTime(),
          parseFloat(data.close),
        ]);

        setChartOptions({
          rangeSelector: {
            selected: 1,
          },
          series: [
            {
              name: ticker,
              data: chartData,
              tooltip: {
                valueDecimals: 2,
              },
              type: 'line',
            },
          ],
          xAxis: {
            type: 'datetime',
          },
          tooltip: {
            xDateFormat: '%Y-%m-%d',
          },
        });

        setChartError(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartError(true);
      } finally {
        setLoadingChart(false);
      }
    };

    if (ticker) {
      fetchChartData();
    }
  }, [ticker, interval]);

  useEffect(() => {
    const fetchStockInfo = async () => {
      const apiKey = '1fd5ef43b97e46cd891f06aeba1f0606';

      try {
        // Request for additional stock info such as market cap, revenue, etc.
        const stockInfoResponse = await axios.get(
          `https://api.twelvedata.com/quote?symbol=${ticker}&apikey=${apiKey}`
        );

        const stockInfoData = stockInfoResponse.data;

        setStockInfo({
          currentPrice: stockInfoData.close ? parseFloat(stockInfoData.close).toFixed(2) : 'N/A',
          weekHigh: stockInfoData.fifty_two_week.high ? parseFloat(stockInfoData.fifty_two_week.high).toFixed(2) : 'N/A',
          weekLow: stockInfoData.fifty_two_week.low ? parseFloat(stockInfoData.fifty_two_week.low).toFixed(2) : 'N/A',
          percent_change: stockInfoData.percent_change ? parseFloat(stockInfoData.percent_change).toFixed(2) : 'N/A',
          volume: stockInfoData.volume ? Math.round(stockInfoData.volume) : 'N/A',
          average_volume: stockInfoData.average_volume ? Math.round(stockInfoData.average_volume) : 'N/A',
        });

        setInfoError(false);
      } catch (error) {
        console.error('Error fetching stock info:', error);
        setInfoError(true); 
      } finally {
        setLoadingInfo(false); // Stop loading for the stock info
      }
    };

    if (ticker) {
      fetchStockInfo();
    }
  }, [ticker]);

  return (
    <div className="chart-container">
      {}
      {loadingChart ? (
        <p>Loading chart data...</p>
      ) : chartError ? (
        <div style={{ height: '65%', width: '100%', flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9' }}>
          <p>Could not fetch data for stock graph. API limit reached. Please try again in 1 minute.</p>
        </div>
      ) : chartOptions ? (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={'stockChart'}
          options={chartOptions}
          containerProps={{ style: { height: '65%', width: '100%', flexGrow: 1 } }} // Ensure the chart takes full height/width
        />
      ) : null}

      {}
      {loadingInfo ? (
        <p>Loading stock info...</p>
      ) : infoError ? (
        <div style={{ flex: '0 0 35%', padding: '20px', background: '#f9f9f9', textAlign: 'center' }}>
          <p>Could not fetch info related to stock. API limit reached. Please try again in 1 minute.</p>
        </div>
      ) : (
        <div className="empty-space">
          <div className="stock-box">
            <h4>Current Price</h4>
            <p>${stockInfo.currentPrice}</p>
          </div>
          <div className="stock-box">
            <h4>Change</h4>
            <p style={{ color: stockInfo.percent_change > 0 ? 'green' : 'red' }}>
              {stockInfo.percent_change}%
            </p>
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
            <h4>Volume</h4>
            <p style={{ color: stockInfo.average_volume < stockInfo.volume ? 'green' : 'red' }}>
              {stockInfo.volume}
            </p>
          </div>
          <div className="stock-box">
            <h4>Average Volume</h4>
            <p>{stockInfo.average_volume}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;
