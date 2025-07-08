import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currency, setCurrency] = useState("usd");

  const currencySymbol =
    {
      usd: "$",
      inr: "₹",
      eur: "€",
      gbp: "£",
    }[currency] || "$";

  useEffect(() => {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error("Error fetching coins:", err));
  }, [currency]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Top 20 Cryptocurrencies
      </h2>

      {/* 🔍 Search + Currency Dropdown */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="usd">USD ($)</option>
          <option value="inr">INR (₹)</option>
          <option value="eur">EUR (€)</option>
          <option value="gbp">GBP (£)</option>
        </select>
      </div>

      <div className="grid-container">
        {filteredCoins.map((coin) => (
          <Link
            to={`/coin/${coin.id}`}
            key={coin.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="coin-card">
              <div className="coin-header">
                <img src={coin.image} alt={coin.name} />
                <div>
                  <h3>{coin.name}</h3>
                  <p>{coin.symbol.toUpperCase()}</p>
                </div>
              </div>
              <div className="coin-body">
                <p>
                  💵 Price: {currencySymbol}
                  {coin.current_price}
                </p>
                <p>
                  📈 Market Cap: {currencySymbol}
                  {coin.market_cap.toLocaleString()}
                </p>
                <p
                  className={
                    coin.price_change_percentage_24h > 0 ? "green" : "red"
                  }
                >
                  🔄 24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
