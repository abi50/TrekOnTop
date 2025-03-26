// pages/PlacePage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RecommendationDto, PlaceDto } from "../types";
import RecommendationCard from "../components/RecommendationCard";
import { GoogleMap, Marker, LoadScript, InfoWindow } from "@react-google-maps/api";

import "../styles/PlacePage.css";

interface GooglePlaceDetails {
    address: string;
    photos: string[];
    rating?: number;
    totalRatings?: number;
}

const mapContainerStyle = {
    width: "100%",
    height: "300px",
    borderRadius: "12px",
    marginTop: "40px",
};

const PlacePage: React.FC = () => {
    const token = localStorage.getItem("token") || ""; 
    const { id } = useParams();
    const [place, setPlace] = useState<PlaceDto | null>(null);
    const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
    const [googleDetails, setGoogleDetails] = useState<GooglePlaceDetails | null>(null);

    useEffect(() => {
        if (!id) return;

        axios.get(`https://localhost:7083/api/Place/${id}`)
            .then(res => setPlace(res.data))
            .catch(console.error);
    }, [id]);

    useEffect(() => {
        if (!place) return;

        axios.get(`https://localhost:7083/api/Recommendation/byPlace/${place.placeId}`)
            .then(res => setRecommendations(res.data))
            .catch(console.error);

        axios.get("https://localhost:7083/api/GooglePlaces/searchByText", {
            params: { query: `${place.placeName}, ${place.latitude}, ${place.longitude}` }
        }).then(res => {
            const googlePlace = res.data.results[0];
            if (!googlePlace) return;

            axios.get("https://localhost:7083/api/GooglePlaces/details", {
                params: { placeId: googlePlace.place_id }
            }).then(detailsRes => {
                const d = detailsRes.data.result;
                const photos = d.photos?.map((p: any) =>
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${p.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
                ) || [];

                setGoogleDetails({
                    address: d.formatted_address,
                    photos,
                    rating: d.rating,
                    totalRatings: d.user_ratings_total
                });
            });
        }).catch(console.error);

    }, [place]);

    if (!place || !googleDetails) return <div className="place-loader">טוען...</div>;
    console.log("🔍 מיקום:", place.latitude, place.longitude);

    return (
        <div className="place-page-wrapper">
            <h1 className="place-name">{place.placeName}</h1>
            <p className="place-address">📍 {googleDetails.address}</p>
            {googleDetails.rating && (
                <p className="place-rating">⭐ {googleDetails.rating} ({googleDetails.totalRatings} ביקורות)</p>
            )}

            {googleDetails.photos.length > 0 && (
                <div className="photo-grid">
                    {googleDetails.photos.map((url, idx) => (
                        <img key={idx} src={url} alt={`מקום ${idx + 1}`} />
                    ))}
                </div>
            )}

            <div className="recommendation-list">
                {recommendations.length > 0 ? (
                    recommendations.map((rec) => (
                        <RecommendationCard
                        key={rec.recoId}
                        recoId={rec.recoId}
                        title={rec.title}
                        description={rec.description}
                        likes={rec.likes}
                        dislikes={rec.dislikes}
                        token={token!}
                      />
                    ))
                ) : (
                    <p className="no-recommendations">אין עדיין המלצות על המקום הזה.</p>
                )}
            </div>
            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: place.latitude, lng: place.longitude }}
                    zoom={13}
                >
                    <Marker position={{ lat: place.latitude, lng: place.longitude }}>
                        {/* <InfoWindow position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}>
                            <div>{place.placeName}</div>
                        </InfoWindow> */}
                    </Marker>
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default PlacePage;
