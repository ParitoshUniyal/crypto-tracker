import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function CoinDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [days, setDays] = useState(7); // 👈 new state for range

  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((res) => res.json())
      .then((data) => setCoin(data))
      .catch((err) => console.error("Error fetching coin details:", err));
  }, [id]);

  // 📊 Fetch price history based on `days`
  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    )
      .then((res) => res.json())
      .then((data) => setHistory(data.prices))
      .catch((err) => console.error("Error fetching chart data:", err));
  }, [id, days]);

  if (!coin) return <div>Loading...</div>;

  const chartData = {
    labels: history.map((entry) =>
      new Date(entry[0]).toLocaleDateString()
    ),
    datasets: [
      {
        label: `${coin.name} Price (USD)`,
        data: history.map((entry) => entry[1]),
        fill: false,
        borderColor: "#007bff",
        backgroundColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "32px", marginBottom: "10px" }}>
        {coin.name} ({coin.symbol.toUpperCase()})
      </h2>
      <img src={coin.image.large} alt={coin.name} width="80" />

      <p
        style={{ marginTop: "10px" }}
        dangerouslySetInnerHTML={{
          __html: coin.description.en
            ? coin.description.en.split(". ")[0] + "."
            : "No description available.",
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Current Price:</strong> ${coin.market_data.current_price.usd}
        </p>
        <p>
          <strong>Market Cap:</strong> $
          {coin.market_data.market_cap.usd.toLocaleString()}
        </p>
        <p>
          <strong>24h Change:</strong>{" "}
          {coin.market_data.price_change_percentage_24h.toFixed(2)}%
        </p>
      </div>

      {/* 📈 Price Chart */}
      <div style={{ marginTop: "40px" }}>
        <h3>Price Chart</h3>

        {/* 👇 Range Selector */}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="range">Select Range: </label>
          <select
            id="range"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            style={{
              padding: "8px",
              fontSize: "14px",
              borderRadius: "6px",
              marginLeft: "10px",
            }}
          >
            <option value="1">1 Day</option>
            <option value="7">7 Days</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            <option value="180">180 Days</option>
            <option value="365">1 Year</option>
          </select>
        </div>

        <Line data={chartData} />
      </div>
    </div>
  );
}

export default CoinDetails;
