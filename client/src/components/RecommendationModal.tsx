import React, { useEffect, useState } from "react";
import { RecommendationDto } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  recommendations: RecommendationDto[];
  onClose: () => void;
}

interface GooglePlaceDetails {
  name: string;
  address: string;
  photos: string[];
  website?: string;
  rating?: number;
  user_ratings_total?: number;
}

const RecommendationModal: React.FC<Props> = ({
  placeId,
  placeName,
  latitude,
  longitude,
  categoryId,
  recommendations,
  onClose
}) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<GooglePlaceDetails | null>(null);
  const token = localStorage.getItem('token');

  const handleLike = async (recoId: number) => {
    try {
      const res = await axios.post(`https://localhost:7083/api/RecommendationLike/Like/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload(); // או עדכון מקומי של רשימת ההמלצות
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (recoId: number) => {
    try {
      const res = await axios.post(`https://localhost:7083/api/RecommendationLike/Dislike/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchGooglePlaceDetails = async () => {
      try {
        const res = await axios.get("https://localhost:7083/api/GooglePlaces/searchByText", {
          params: { query: `${placeName}, ${latitude}, ${longitude}` }
        });
        const place = res.data.results[0];
        if (place) {
          const detailsRes = await axios.get("https://localhost:7083/api/GooglePlaces/details", {
            params: { placeId: place.place_id }
          });

          const d = detailsRes.data.result;
          const photos = d.photos?.map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          ) || [];

          setDetails({
            name: d.name,
            address: d.formatted_address,
            photos,
            website: d.website,
            rating: d.rating,
            user_ratings_total: d.user_ratings_total
          });
        }
      } catch (err) {
        console.error("Failed to fetch Google place details", err);
      }
    };
    fetchGooglePlaceDetails();
  }, [latitude, longitude]);

  const handleAddRecommendation = () => {
    const placeDetails = {
      placeId,
      placeName,
      latitude,
      longitude,
      cityName: "",
      countryName: "",
      countryCode: "",
      categoryId // ✅ נשמר
    };
    localStorage.setItem("selectedPlace", JSON.stringify(placeDetails));
    navigate("/addReco");
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "white", borderRadius: 10, padding: 20, width: "60%", maxHeight: "90%", overflowY: "auto" }}>
        <h2>המלצות על {placeName}</h2>

        {details && (
          <div style={{ marginBottom: 10 }}>
            <p><strong>כתובת:</strong> {details.address}</p>
            {details.rating && (
              <p><strong>דירוג:</strong> ⭐ {details.rating} ({details.user_ratings_total} ביקורות)</p>
            )}
            {details.website && <p><a href={details.website} target="_blank" rel="noopener noreferrer">🌐 אתר</a></p>}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {details.photos.slice(0, 5).map((url, idx) => (
                <img key={idx} src={url} alt="מקום" style={{ width: 120, borderRadius: 10 }} />
              ))}
            </div>
          </div>
        )}

        <button onClick={handleAddRecommendation}>➕ הוסף המלצה</button>
        <button onClick={onClose} style={{ float: "left" }}>❌ סגור</button>

        <ul style={{ marginTop: 20 }}>
          {recommendations.map((reco) => (
            <li key={reco.recoId} style={{ marginBottom: 10 }}>
              <h4>{reco.title}</h4>
              <p>{reco.description}</p>
              <small>👍 {reco.likes} | 👎 {reco.dislikes}</small>
              {token && (
                <div style={{ marginTop: 5 }}>
                  <button onClick={() => handleLike(reco.recoId)}>👍</button>
                  <button onClick={() => handleDislike(reco.recoId)}>👎</button>
                </div>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};

export default RecommendationModal;
