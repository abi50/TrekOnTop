import React, { useState } from "react";
import axios from "axios";
import "../styles/ChangePasswordModal.css";

interface Props {
  token: string;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ token, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  token = localStorage.getItem('token') || "";

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (newPassword !== confirm) {
      setError("הסיסמאות החדשות לא תואמות");
      return;
    }

    try {
      console.log("Current Password", currentPassword);
      // אימות סיסמה נוכחית
      await axios.post(
        "https://localhost:7083/api/auth/verify-password",
        currentPassword,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("newPassword", newPassword);
      // שינוי סיסמה
      await axios.put("https://localhost:7083/api/auth/change-password", JSON.stringify(newPassword), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
     

      setSuccess("הסיסמה עודכנה בהצלחה!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");

    } catch (e) {
      setError("סיסמה נוכחית שגויה או שגיאה בעדכון.");
    }
  };

  return (
    <div className="change-password-backdrop">
      <div className="change-password-box">
        <h3>שינוי סיסמה</h3>
        <input
          type="password"
          placeholder="סיסמה נוכחית"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="סיסמה חדשה"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="אימות סיסמה חדשה"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        <div className="modal-actions">
          <button onClick={handleSubmit}>שנה</button>
          <button onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
