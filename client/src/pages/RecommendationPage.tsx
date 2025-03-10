import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RecommendationPage.css";

import "../styles/Home.css";

const RecommendationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(false);

  useEffect(() => {
    axios
    .get(`https://localhost:7083/api/Recommendation/${id}`)
    .then((response) => {
        setRecommendation(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch recommendation");
        setLoading(false);
      });
    
    // בדיקת האם המשתמש מחובר
    const token = localStorage.getItem("authToken");

    if (token) {
      axios.get("https://localhost:7083/api/Auth/Check", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(() => setUserLoggedIn(true))
        .catch(() => setUserLoggedIn(false));
    } else {
      setUserLoggedIn(false);
    }

  }, [id]);

  const handleLike = () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setShowAuthMessage(true);
      return;
    }
  
    axios.post(`https://localhost:7083/api/RecommendationLike/Like/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      setRecommendation(response.data);
    })
    .catch(() => {
      setError("Failed to update like");
    });
  };
  
  const handleDislike = () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      setShowAuthMessage(true);
      return;
    }
  
    axios.post(`https://localhost:7083/api/RecommendationLike/Dislike/${id}`, {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((response) => {
      setRecommendation(response.data);
    })
    .catch(() => {
      setError("Failed to update dislike");
    });
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recommendation-container">
      <h1 className="recommendation-title">{recommendation.title}</h1>
      <p className="recommendation-description">{recommendation.description}</p>
      <div className="recommendation-actions">
        <button className="like-button" onClick={handleLike}>👍 {recommendation.likes}</button>
        <button className="dislike-button" onClick={handleDislike}>👎 {recommendation.dislikes}</button>
      </div>
      {showAuthMessage && (
        <div className="auth-message">
          <p>עליך להיות מחובר כדי לתת לייקים ודיסלייקים.</p>
          <button className="register-button" onClick={() => navigate("/login")}>הירשם עכשיו</button>
          <button className="cancel-button" onClick={() => setShowAuthMessage(false)}>ביטול</button>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
