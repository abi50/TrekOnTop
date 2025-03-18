import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecommendationCard.css";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";


interface RecommendationCardProps {
  recommendation: RecommendationDto;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [images, setImages] = useState<ImageDto[]>([]);
  const navigate = useNavigate();
  const [currentRecommendation, setCurrentRecommendation] = useState(recommendation);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios.get(`https://localhost:7083/api/Recommendation/${recommendation.recoId}/images`)
      .then(res => setImages(res.data))
      .catch(console.error);
  }, [recommendation.recoId]);
  

  useEffect(() => {
    const token = localStorage.getItem("token"); // אם את משתמשת ב-localStorage
    axios.get(`https://localhost:7083/api/User/${recommendation.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(console.error);
  }, [recommendation.userId]);
  
  

  const handleLikeDislike = async (action: "Like" | "Dislike") => {
    if (!token) {
      setShowAuthMessage(true);
      return;
    }

    try {
      const response = await axios.post(`https://localhost:7083/api/Recommandation/${action}/${recommendation.recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCurrentRecommendation(prev => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="recommendation-card">
      <img 
        className="user-image"
        src={`data:image/jpeg;base64,${user?.profilPic}`}
        alt="User Profile"
      />
      <h4>{recommendation.title}</h4>
      <p>{recommendation.description}</p>
      <div className="recommendation-images">
          {images.map(img => (
            <img key={img.imageId} src={`https://localhost:7083/api/Image/getimage/${img.imageId}`} alt="recommendation" />
          ))}
        </div>

      <div className="likes">👍 {recommendation.likes} | 👎 {recommendation.dislikes}</div>
    </div>
  );
};

export default RecommendationCard;
