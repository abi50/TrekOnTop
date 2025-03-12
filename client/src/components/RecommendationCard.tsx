import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";

interface RecommendationCardProps {
  recommendation: RecommendationDto;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    axios.get(`https://localhost:7083/api/User/${recommendation.userId}`)
      .then(response => setUser(response.data))
      .catch(console.error);
  }, [recommendation.userId]);

  return (
    <div className="recommendation-card">
      <img 
        className="user-image"
        src={`data:image/jpeg;base64,${user?.profilPic}`}
        alt="User Profile"
      />
      <h4>{recommendation.title}</h4>
      <p>{recommendation.description}</p>
      <div className="likes">👍 {recommendation.likes} | 👎 {recommendation.dislikes}</div>
    </div>
  );
};

export default RecommendationCard;
