// components/PlaceCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecommendationCard from "../components/RecommendationCard";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";

interface PlaceCardProps {
  place: PlaceDto;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const navigate = useNavigate();
  const handleClickAddReco = () => {
    navigate('/addReco', { state: { place } });
  };
  useEffect(() => {
    axios.get(`https://localhost:7083/api/Recommendation`)
      .then(res => setRecommendations(res.data.filter((r: RecommendationDto) => r.placeId === place.placeId)
    ))
      .catch(console.error);

    axios.get("https://localhost:7083/api/Image")
      .then(response => {
        const relevantImages = response.data.filter((img: ImageDto) =>
          recommendations.some(rec => rec.recoId === img.recommendationId)
        );
        setImages(relevantImages);
      })
      .catch(error => console.error(error));
  }, [place.placeId, recommendations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // כל 5 שניות מחליף תמונה

    return () => clearInterval(interval);
  }, [images]);


  return (
    <div className="place-card">
      <img className="place-image" src={images.length ? `https://localhost:7083/api/Image/getimage/${images[currentImage].imageId}` : '/default-image.png'} alt={place.placeName} />
      
      <div className="place-info">
        <h2>{place.placeName}</h2>
        <button onClick={() => setShowRecommendations(!showRecommendations)} className="btn-read-more">
          {showRecommendations ? 'סגור המלצות' : 'קרא עוד'}
        </button>
      </div>
    
      {showRecommendations && (
        
        <div className="recommendations-container">
       <button onClick={handleClickAddReco} className="btn-add-recommendation">
         הוסף המלצה
       </button>          {recommendations.map(rec => (
            <RecommendationCard key={rec.recoId} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
    );
    
};

export default PlaceCard;
