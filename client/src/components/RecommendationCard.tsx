import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecommendationCard.css";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";
// import * as FaIcons from "react-icons/fa";


interface RecommendationCardProps {
  recommendation: RecommendationDto;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [images, setImages] = useState<ImageDto[]>([]);
  const navigate = useNavigate();
  const [currentRecommendation, setCurrentRecommendation] = useState(recommendation);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`https://localhost:7083/api/Recommendation/${recommendation.recoId}/images`)
      .then(res => setImages(res.data))
      .catch(console.error);
  }, [recommendation.recoId]);
  

  useEffect(() => {
    // const token = localStorage.getItem("token"); // אם את משתמשת ב-localStorage
   
    axios.get(`https://localhost:7083/api/Recommendation/${recommendation.recoId}/user`)
      .then(response => {
        setUser(response.data);
        console.log(user?.name);
        console.log(user?.profilPic);

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
      console.log(response.data);
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
  <img className="user-image" src={`https://localhost:7083/api/User/getimage/${user?.userId}`} alt={user?.name || 'משתמש'} />
  <div className="recommendation-content">
    <h4>{recommendation.title}</h4>
    <small>הועלה ע"י: {user?.name}</small>
    <p>
      {recommendation.description.length > 100 && !showFullDescription
        ? recommendation.description.slice(0, 100) + '...'
        : recommendation.description}
      {recommendation.description.length > 100 && (
        <button className="btn-read-more" onClick={() => setShowFullDescription(prev => !prev)}>
          {/* {showFullDescription ? 'הסתר' : 'הצג הכל'} {showFullDescription ? <FaIcons.FaChevronUp /> : <FaIcons.FaChevronDown />} */}
        </button>
      )}
    </p>
    <div className="recommendation-images">
           {images.map(img => (
             <img key={img.imageId} src={`https://localhost:7083/api/Image/getimage/${img.imageId}`} alt="recommendation" />
           ))}
         </div>
    <div className="likes">
      <button className="like-btn" onClick={() => handleLikeDislike('Like')}>
        {/* <FaIcons.FaThumbsUp />  */}
        {recommendation.likes}
      </button>
      <button className="dislike-btn" onClick={() => handleLikeDislike('Dislike')}>
        {/* <FaIcons.FaThumbsDown /> */}
         {recommendation.dislikes}
      </button>
    </div>
  </div>
</div>
    );
        
 
};

export default RecommendationCard;
