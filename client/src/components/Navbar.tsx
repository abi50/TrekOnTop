import React from "react";
import "../styles/Home.css";

interface NavbarProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  return (
    <nav className="navbar">
      <h2>🌍 המלצות למטייל</h2>
      <input type="text" placeholder="🔍 חפש מקום..." onChange={onSearch} className="nav-search" />
      <div className="nav-links">
        <a href="/">בית</a>
        <a href="/places">מקומות</a>
        <a href="/categories">קטגוריות</a>
        <a href="/login">התחברות</a>
      </div>
    </nav>
  );
};

export default Navbar;
