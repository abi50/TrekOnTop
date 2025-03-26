// components/PlaceCard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import RecommendationCard from "../components/RecommendationCard";
import { RecommendationDto, PlaceDto, ImageDto, UserDto } from "../types";
import { useNavigate } from "react-router-dom";
import "../styles/PlaceCard.css";
import RecommendationModal from "./RecommendationModal";

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
  const [showModal, setShowModal] = useState(false);
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
    axios.get("https://localhost:7083/api/Recommendation/byPlace/" + place.placeId)
      .then(res => setRecommendations(res.data))
      .catch(console.error);

    axios.get("https://localhost:7083/api/Image")
      .then(res => {
        const relevant = res.data.filter((img: ImageDto) =>
          res.data.some((rec: RecommendationDto) => rec.recoId === img.recommendationId)
        );
        setImages(relevant);
      })
      .catch(console.error);
  }, [place.placeId]);

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
  useEffect(() => {
    axios.get("https://localhost:7083/api/GooglePlaces/searchByText", {
      params: { query: `${place.placeName}, ${place.latitude}, ${place.longitude}` }
    }).then(res => {
      const result = res.data.results[0];
      if (!result) return;
      return axios.get("https://localhost:7083/api/GooglePlaces/details", {
        params: { placeId: result.place_id }
      });
    }).then(res => {
      if (res) {
        const d = res.data.result;
   
        setGoogleDetails({
          name: d.name,

          address: d.formatted_address,
          photos: d.photos?.map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          ) || [],
          rating: d.rating,
          user_ratings_total: d.user_ratings_total,
          website: d.website
        });
      }
    }).catch(console.error);
  }, [place.placeName]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);
return (
  <div className="place-card" onClick={() => navigate(`/place/${place.placeId}`)}>
  <div
    className="place-card-background"
    style={{
      backgroundImage: `url(${googleDetails?.photos?.[0] || "/default-image.png"})`,
    }}
  >
    <div className="place-card-overlay">
      <h2 className="place-name">{googleDetails?.name || place.placeName}</h2>
      <p className="place-location">📍 {googleDetails?.address}</p>
      {googleDetails?.rating && (
        <p className="place-rating">⭐ {googleDetails.rating} ({googleDetails.user_ratings_total} ביקורות)</p>
      )}
    </div>
  </div>

  <div className="place-card-footer">
    <img
      src="/icons/search.png"
      alt="מעבר לדף המקום"
      className="footer-icon"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/place/${place.placeId}`);
      }}
    />
    <img
      src="/icons/eye.gif"
      alt="הצג המלצות"
      className="footer-icon"
      onClick={(e) => {
        e.stopPropagation();
        setShowModal(true);
      }}
    />
  </div>

  {showModal && (
    <RecommendationModal
      placeId={place.placeId}
      placeName={place.placeName}
      latitude={place.latitude}
      longitude={place.longitude}
      categoryId={place.categoryId}
      recommendations={recommendations}
      onClose={() => setShowModal(false)}
    />
  )}
</div>
);
};

export default PlaceCard;
