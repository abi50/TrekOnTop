import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/RecommendationPage.css";

const RecommendationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [id]);

  const handleLike = () => {
    axios.post(`/api/recommendation/like/${id}`)
      .then((response) => {
        setRecommendation(response.data);
      })
      .catch(() => {
        setError("Failed to update like");
      });
  };

  const handleDislike = () => {
    axios.post(`/api/recommendation/dislike/${id}`)
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
    </div>
  );
};

export default RecommendationPage;
