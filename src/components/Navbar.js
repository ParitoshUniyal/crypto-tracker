import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🪙 CryptoTracker
      </Link>

      {/* 🌗 Dark Mode Toggle */}
      <div style={{ marginRight: "20px" }}>
        <label style={{ marginRight: "8px" }}>Dark Mode</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>
    </nav>
  );
}

export default Navbar;
