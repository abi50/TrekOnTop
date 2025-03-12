// components/PlaceCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecommendationCard from "../components/RecommendationCard";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";

interface PlaceCardProps {
  place: PlaceDto;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);

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
    <div className="place-card" onClick={() => setShowRecommendations(!showRecommendations)}>
      <div 
        className="place-image" 
        style={{
            backgroundImage: images.length 
              ? `url(https://localhost:7083/api/Image/getimage/${images[currentImage].imageId})` 
              : undefined,
            backgroundColor: images.length ? undefined : "#ccc"
          }}
                />
      <div className="place-info">
        <h2>{place.placeName}</h2>
        <p>סה"כ המלצות: {recommendations.length}</p>
      </div>
      {showRecommendations && (
        <div className="recommendations-container">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.recoId} recommendation={rec} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceCard;
