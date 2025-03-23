import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/UserModal.css";

interface Props {
  token: string;
  onClose: () => void;
}

const ExportUserDataModal: React.FC<Props> = ({ token, onClose }) => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [recs, user] = await Promise.all([
          axios.get("https://localhost:7083/api/Recommendation", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://localhost:7083/api/auth/check", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userRecs = recs.data.filter((r: any) => r.userId === user.data.userId);

        setData({
          user: user.data,
          recommendations: userRecs,
        });
      } catch (e) {
        console.error("שגיאה בטעינת נתונים לייצוא", e);
      }
    };

    fetchUserData();
  }, [token]);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "user-data.json";
    link.click();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>ייצוא נתוני משתמש</h3>
        <p>באפשרותך להוריד קובץ JSON עם כל המידע שלך במערכת.</p>
        <div className="modal-actions">
          <button onClick={handleDownload} disabled={!data}>הורד</button>
          <button onClick={onClose}>סגור</button>
        </div>
      </div>
    </div>
  );
};

export default ExportUserDataModal;
