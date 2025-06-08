import React, { useState } from "react";
import "../styles/AdminPages.css";

const AdminEmailEditor = () => {
  const [email, setEmail] = useState(localStorage.getItem("adminEmail") || "abigalBerk@gmail.com");

  const handleSave = () => {
    localStorage.setItem("adminEmail", email);
    alert("המייל של המנהל עודכן. יש להיכנס עם המייל החדש בפעם הבאה.");
  };

  return (
    <div className="admin-page wallet-style">
      <h2 className="admin-title">✉ שינוי מייל מנהל</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="admin@email.com"
        className="admin-input"
      />
      <br />
      <button className="btn-save" onClick={handleSave}>שמור</button>
    </div>
  );
};

export default AdminEmailEditor;
