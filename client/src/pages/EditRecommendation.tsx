import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/EditRecommendation.css";

const EditRecommendation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [recoId, setRecoId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [placeId, setPlaceId] = useState<number>(0);
  const [images, setImages] = useState<any[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("editRecommendation");
    if (saved) {
      const data = JSON.parse(saved);
      setRecoId(data.recoId);
      setUserId(data.userId);
      setTitle(data.title);
      setDescription(data.description);
      setPlaceName(data.placeName || "לא ידוע");
      setPlaceId(data.placeId);
    }
  }, []);

  useEffect(() => {
    if (!recoId) return;

    axios.get(`https://localhost:7083/api/Recommendation/${recoId}/images`)
      .then(res => setImages(res.data))
      .catch(console.error);

    axios.get(`https://localhost:7083/api/Recommendation/${recoId}/user`)
      .then(res => setUser(res.data))
      .catch(console.error);
  }, [recoId]);

  const handleDeleteImage = async (imageId: number) => {
    try {
      await axios.delete(`https://localhost:7083/api/Image/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(prev => prev.filter(img => img.imageId !== imageId));
    } catch (err) {
      alert("שגיאה במחיקת תמונה");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:7083/api/Recommendation/${recoId}`, {
        recoId,
        title,
        description,
        userId,
        placeId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      for (const file of newFiles) {
        const formData = new FormData();
        formData.append("RecommendationId", recoId.toString());
        formData.append("File", file);

        await axios.post("https://localhost:7083/api/Image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        });
      }

      localStorage.removeItem("editRecommendation");
      alert("ההמלצה נשמרה בהצלחה!");
      navigate("/profilePage");
    } catch (err) {
      alert("שגיאה בעדכון ההמלצה");
      console.error(err);
    }
  };

  return (
    <div className="edit-reco-container">
      <a className="back-link" href="/profilePage">← חזרה לפרופיל</a>
      <h2>✏ עריכת המלצה</h2>

      <div className="reco-info">
        <div><strong>🧭 מקום:</strong> {placeName}</div>
        <div><strong>👤 נכתב על ידי:</strong> {user?.name}</div>
      </div>

      <input
        type="text"
        placeholder="כותרת"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="תיאור"
        value={description}
        rows={6}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="image-section">
        <h4>📷 תמונות קיימות</h4>
        <div className="image-list">
          {images.map((img) => (
            <div className="image-wrapper" key={img.imageId}>
              <img src={`https://localhost:7083/api/Image/getimage/${img.imageId}`} alt="תמונה" />
              <button onClick={() => handleDeleteImage(img.imageId)}>🗑</button>
            </div>
          ))}
        </div>

        <h4>➕ הוספת תמונות חדשות</h4>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setNewFiles(Array.from(e.target.files));
            }
          }}
        />
      </div>

      <button className="save-btn" onClick={handleSave}>💾 שמור שינויים</button>
    </div>
  );
};

export default EditRecommendation;
