import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RecommendationCard.css";
import { RecommendationDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";

interface RecommendationCardProps {
  recommendation: RecommendationDto;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [currentRecommendation, setCurrentRecommendation] = useState(recommendation);
  const [showAuthMessage, setShowAuthMessage] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [likeClicked, setLikeClicked] = useState(false);
  const [dislikeClicked, setDislikeClicked] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://localhost:7083/api/Recommendation/${recommendation.recoId}/images`)
      .then(res => setImages(res.data))
      .catch(console.error);
  }, [recommendation.recoId]);

  useEffect(() => {
    axios.get(`https://localhost:7083/api/Recommendation/${recommendation.recoId}/user`)
      .then(response => setUser(response.data))
      .catch(console.error);
  }, [recommendation.userId]);

  useEffect(() => {
    if (token) {
      axios.get("https://localhost:7083/api/auth/check", {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setTokenValid(false);
      });
    } else {
      setTokenValid(false);
    }
  }, []);

  const handleLikeDislike = async (action: "Like" | "Dislike") => {
    if (!token) {
      setShowAuthMessage(true);
      return;
    }

    try {
      const response = await axios.post(
        `https://localhost:7083/api/RecommendationLike/${action}/${recommendation.recoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCurrentRecommendation(prev => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes
      }));

      if (action === "Like") {
        setLikeClicked(true);
        setDislikeClicked(false);
        setTimeout(() => setLikeClicked(false), 200);
      } else {
        setDislikeClicked(true);
        setLikeClicked(false);
        setTimeout(() => setDislikeClicked(false), 200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true
  };

  return (
    <div className="recommendation-card">
      <img
        className="user-image"
        src={`https://localhost:7083/api/User/getimage/${user?.userId}`}
        alt={user?.name || 'משתמש'}
      />
      <div className="recommendation-content">
        <h4>{recommendation.title}</h4>
        <small>הועלה ע"י: {user?.name}</small>
        <p>
          {recommendation.description.length > 100 && !showFullDescription
            ? recommendation.description.slice(0, 100) + '...'
            : recommendation.description}
          {recommendation.description.length > 100 && (
            <button
              className="btn-read-more"
              onClick={() => setShowFullDescription(prev => !prev)}
            >
              {showFullDescription ? 'הסתר ▲' : 'הצג הכל ▼'}
            </button>
          )}
        </p>

        {images.length > 0 && (
          <div className="recommendation-slider">
            <Slider {...sliderSettings}>
              {images.map(img => (
                <div key={img.imageId}>
                  <img
                    src={`https://localhost:7083/api/Image/getimage/${img.imageId}`}
                    alt="recommendation"
                    className="slider-image"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}

        {tokenValid && (
          <div className="likes">
            <button
              className={`like-btn ${likeClicked ? "clicked" : ""}`}
              onClick={() => handleLikeDislike("Like")}
              style={{ color: likeClicked ? '#2c7' : '#444' }}
            >
              👍 {currentRecommendation.likes}
            </button>
            <button
              className={`dislike-btn ${dislikeClicked ? "clicked" : ""}`}
              onClick={() => handleLikeDislike("Dislike")}
              style={{ color: dislikeClicked ? '#e33' : '#444' }}
            >
              👎 {currentRecommendation.dislikes}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;
