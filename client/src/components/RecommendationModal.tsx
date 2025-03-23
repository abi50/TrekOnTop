import React, { useEffect, useState } from "react";
import { RecommendationDto } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  recommendations: RecommendationDto[];
  onClose: () => void;
}

interface GooglePlaceDetails {
  name: string;
  address: string;
  photos: string[];
  website?: string;
}

const RecommendationModal: React.FC<Props> = ({
  placeId,
  placeName,
  latitude,
  longitude,
  recommendations,
  onClose
}) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<GooglePlaceDetails | null>(null);

  useEffect(() => {
    const fetchGooglePlaceDetails = async () => {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50&key=${apiKey}`
        );
        const place = res.data.results[0];
        if (place) {
          const detailsRes = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,photos,website&key=${apiKey}`
          );
          const d = detailsRes.data.result;
          const photos = d.photos?.map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${apiKey}`
          ) || [];
          setDetails({
            name: d.name,
            address: d.formatted_address,
            photos,
            website: d.website,
          });
        }
      } catch (err) {
        console.error("Failed to fetch Google place details", err);
      }
    };
    fetchGooglePlaceDetails();
  }, [latitude, longitude]);

  const handleAddRecommendation = () => {
    localStorage.setItem("selectedPlace", JSON.stringify({ placeId, placeName }));
    navigate("/add-recommendation");
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
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecommendationModal;
