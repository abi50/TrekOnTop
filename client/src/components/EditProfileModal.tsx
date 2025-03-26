import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import "../styles/EditProfileModal.css";

interface EditProfileModalProps {
  user: {
    id: number;
    name: string;
    email: string;
    token: string;
  };
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    console.log("updating user...");
    const form = new FormData();
    form.append("Name", name);
    form.append("Email", user.email); // אימייל נשאר קבוע
    form.append("Password", password || ""); // אם לא שונה – שלח ריק
    if (file) form.append("File", file);
    console.log("form:", form);
    try {
      await axios.put(`/api/User/${user.id}`, form, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      alert("הפרטים עודכנו בהצלחה");
      onClose();
      window.location.reload();
    } catch (e) {
      console.error("שגיאה בעדכון המשתמש:", e);
      alert("שגיאה בעדכון המשתמש");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>עריכת פרופיל</h3>

        <label>שם</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>סיסמה חדשה</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="השאר ריק אם לא לשנות"
        />

        <label>תמונת פרופיל</label>
        <input type="file" onChange={handleFileChange} />

        <div className="modal-actions">
          <button className="save" onClick={handleSubmit}>שמור</button>
          <button className="cancle" onClick={onClose}>ביטול</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
