import React, { useState } from "react";
import axios from "axios";
import "../styles/PasswordVerificationModal.css";

interface PasswordVerificationModalProps {
  token: string;
  onSuccess: () => void;
  onClose: () => void;
}

const PasswordVerificationModal: React.FC<PasswordVerificationModalProps> = ({ token, onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
     token = localStorage.getItem('token') || "";
  const handleVerify = async () => {
    try {
        console.log("Password", password); 
        console.log("Token", token);
      const res = await axios.post(
        "https://localhost:7083/api/auth/verify-password",
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onSuccess();
    } catch (e) {
      setError("סיסמה שגויה. נסה שוב.");
    }
  };

  return (
    <div className="password-modal-backdrop">
      <div className="password-modal-box">
        <h3>אימות סיסמה</h3>
        <p>הכנס את הסיסמה שלך כדי לערוך את הפרופיל</p>
        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-text">{error}</p>}
        <div className="modal-actions">
          <button onClick={handleVerify}>אמת</button>
          <button onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordVerificationModal;
