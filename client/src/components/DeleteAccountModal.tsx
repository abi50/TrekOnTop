import React from "react";
import axios from "axios";
import "../styles/UserModal.css";

interface Props {
  userId: number;
  token: string;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<Props> = ({ userId, token, onClose }) => {
token = localStorage.getItem("token") || "";
  const handleDelete = async () => {
    if (!token) {
      alert("אתה לא מחובר. אנא התחבר ונסה שוב.");
      return;
    }

    try {
      const response = await axios.delete(`https://localhost:7083/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        alert("החשבון נמחק בהצלחה.");
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert(`מחיקת החשבון נכשלה. קוד שגיאה: ${response.status}`);
      }

    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        alert(`שגיאה במחיקת החשבון: ${error.response.status} - ${error.response.data?.message || error.message}`);
        console.error("Server responded with:", error.response.data);
      } else {
        alert("שגיאה לא צפויה במחיקת החשבון.");
        console.error("Unexpected error:", error);
      }
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
