import React, { useState } from "react";
import { useSearch } from "../context/SearchContext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reduxs/store";
import { logout } from "../reduxs/userSlice";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { setSearchQuery } = useSearch();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  const adminEmail = localStorage.getItem("adminEmail") || "abigalBerk@gmail.com";
  const isAdmin = user?.email === adminEmail;

  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <img src="/images/logo.webp" alt="Trek on Top Logo" />
        <span className="logo-text">Trek on Top</span>
      </a>

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
        <a href="/map">מקומות בקרבתי</a>
        <a href="/addReco">הוספת המלצה</a>  
        {isAdmin && <a href="/admin/categories">ניהול קטגוריות</a>}

      </div>

      <div className="user-area">
        {user ? (
          <div className="profile-wrapper">
            <img
              src={`https://localhost:7083/api/User/getimage/${user.id}`}
              alt="Profile"
              className="profile-pic"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="dropdown-menu">
                <a href="/profilePage">פרופיל</a>
                {isAdmin && <a href="/admin/change-admin-email">שינוי מייל מנהל</a>}
                <button onClick={handleLogout}>התנתק</button>
              </div>
            )}
          </div>
        ) : (
          <a className="login-link" href="/auth">התחברות / הרשמה</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
