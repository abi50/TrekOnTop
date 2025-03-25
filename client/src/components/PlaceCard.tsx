// components/PlaceCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecommendationCard from "../components/RecommendationCard";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";

interface PlaceCardProps {
  place: PlaceDto;
}
interface GooglePlaceDetails {
  name: string;
  address: string;
  photos: string[];
  website?: string;
  rating?: number;
  user_ratings_total?: number;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
  const [images, setImages] = useState<ImageDto[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [googleDetails, setGoogleDetails] = useState<GooglePlaceDetails | null>(null);
  const navigate = useNavigate();
  const handleClickAddReco = () => {
    const placeDetails = {
      placeId: place.placeId,
      placeName: place.placeName,
      latitude: place.latitude,
      longitude: place.longitude,
      categoryId: place.categoryId ,
      cityName: "", // תוכל לעדכן אם יש
      countryName: "",
      countryCode: ""
    };
    localStorage.setItem("selectedPlace", JSON.stringify(placeDetails));
    navigate('/addReco');
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
    const fetchGooglePlaceDetails = async () => {
      try {
        const res = await axios.get("https://localhost:7083/api/GooglePlaces/searchByText", {
          params: { query: `${place.placeName}, ${place.latitude}, ${place.longitude}` }
        });

        const googlePlace = res.data.results[0];
        if (!googlePlace) return;

        const detailsRes = await axios.get("https://localhost:7083/api/GooglePlaces/details", {
          params: { placeId: googlePlace.place_id }
        });

        const d = detailsRes.data.result;
        const photos: string[] = d.photos?.map((p: any) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
        ) || [];

        setGoogleDetails({
          name: d.name,
          address: d.formatted_address,
          photos,
          website: d.website,
          rating: d.rating,
          user_ratings_total: d.user_ratings_total
        });
      } catch (err) {
        console.error("Google place info error:", err);
      }
    };

    fetchGooglePlaceDetails();
  }, [place.placeName, place.latitude, place.longitude]);

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

        {googleDetails && (
          <div className="google-info" style={{
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "10px",
            marginTop: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <p><strong>כתובת:</strong> {googleDetails.address}</p>
            {googleDetails.rating && (
              <p><strong>דירוג:</strong> ⭐ {googleDetails.rating} ({googleDetails.user_ratings_total} ביקורות)</p>
            )}
            {googleDetails.website && (
              <p><a href={googleDetails.website} target="_blank" rel="noopener noreferrer">🌐 אתר</a></p>
            )}
            {googleDetails.photos.length > 0 && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginTop: 8 }}>
                {googleDetails.photos.slice(0, 5).map((url: string, idx: number) => (
                  <img key={idx} src={url} alt="מקום" style={{ width: 100, height: 80, borderRadius: 8, objectFit: 'cover' }} />
                ))}
              </div>
            )}
          </div>
        )}
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
