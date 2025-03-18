import React from "react";
import { useSearch } from "../context/SearchContext";
import "../styles/Home.css";

const Navbar: React.FC = () => {
  const { setSearchQuery } = useSearch();

  return (
    <nav className="navbar">
      <h2>🌍 המלצות למטייל</h2>
      <input
        type="text"
        placeholder="🔍 חפש מקום..."
        onChange={(e) => setSearchQuery(e.target.value)}
        className="nav-search"
      />
      <div className="nav-links">
        <a href="/">בית</a>
        <a href="/places">מקומות</a>
        <a href="/categories">קטגוריות</a>
        <a href="/auth">התחברות</a>
        <a href="/map">מקומות בקרבתי</a>
      </div>
    </nav>
  );
};

export default Navbar;
