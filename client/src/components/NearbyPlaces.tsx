import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { PlaceDto, RecommendationDto } from "../types";
import axios from 'axios';

const mapContainerStyle = {
    width: '100%',
    height: '600px',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
};

const center = {
    lat: 32.0853,
    lng: 34.7818
};

const NearbyPlaces: React.FC = () => {
    const [places, setPlaces] = useState<PlaceDto[]>([]);
    const [recommendations, setRecommendations] = useState<Record<number, RecommendationDto[]>>({});

    const fetchNearbyPlaces = async (lat: number, lng: number, radius: number = 10) => {
        try {
            const response = await axios.get<PlaceDto[]>(
                `/api/Place/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
            );
            setPlaces(response.data);

            const recs: Record<number, RecommendationDto[]> = {};

            await Promise.all(response.data.map(async (place) => {
                const recResponse = await axios.get<RecommendationDto[]>(`/api/Recommendation/byPlace/${place.placeId}`);
                recs[place.placeId] = recResponse.data;
            }));

            setRecommendations(recs);

        } catch (error) {
            console.error("Error fetching nearby places or recommendations:", error);
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            fetchNearbyPlaces(lat, lng);
        }
    };

    return (
        <div style={{padding: "20px", textAlign: 'center'}}>
            <h2>חיפוש מקומות באזור שלך 🌍</h2>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    onClick={handleMapClick}
                >
                    {places.map((place) => (
                        <Marker
                            key={place.placeId}
                            position={{ lat: place.latitude, lng: place.longitude }}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                {places.map((place) => (
                    <div key={place.placeId}>
                        <h3>{place.placeName}</h3>
                        {recommendations[place.placeId]?.length > 0 ? (
                            <ul>
                                {recommendations[place.placeId].map((reco) => (
                                    <li key={reco.recoId}>
                                        <strong>{reco.title}</strong>
                                        <p>{reco.description}</p>
                                        <small>👍 {reco.likes} | 👎 {reco.dislikes}</small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>אין המלצות למקום זה.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyPlaces;
