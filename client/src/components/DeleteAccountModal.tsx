import React from "react";
import axios from "axios";
import "../styles/UserModal.css";

interface Props {
  userId: number;
  token: string;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ userId, token, onClose }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`https://localhost:7083/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("החשבון נמחק בהצלחה.");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (e) {
      alert("שגיאה במחיקת החשבון.");
      console.error(e);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>מחיקת חשבון</h3>
        <p>האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו בלתי הפיכה.</p>
        <div className="modal-actions">
          <button onClick={handleDelete}>מחק</button>
          <button onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
