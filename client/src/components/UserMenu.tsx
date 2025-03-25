import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../reduxs/userSlice";
import "../styles/UserMenu.css";

interface Props {
  profileImage: string;
  name: string;
  email: string;
  onEdit: () => void;
  onChangePassword: () => void;
  onExport: () => void;
  onDelete: () => void;
}

const UserMenu: React.FC<Props> = ({
  profileImage,
  name,
  email,
  onEdit,
  onChangePassword,
  onExport,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="user-menu-container" ref={ref}>
      <img
        src={profileImage}
        alt="Profile"
        className="profile-avatar"
        onClick={() => setOpen(!open)}
      />
      {open && (
        <div className="user-dropdown">
          <div className="user-info">
            <strong>{name}</strong>
            <span>{email}</span>
          </div>
          <button onClick={onEdit}>✏ עריכת פרופיל</button>
          <button onClick={onChangePassword}>🔑 שינוי סיסמה</button>
          <button onClick={onExport}>📁 ייצוא נתונים</button>
          <button onClick={onDelete}>🗑 מחיקת חשבון</button>
          <hr />
          <button onClick={handleLogout}>🚪 התנתק</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
