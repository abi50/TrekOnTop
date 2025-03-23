import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import FilterPanel from "../components/FilterPanel";
import RecommendationModal from "../components/RecommendationModal";
import { PlaceDto, RecommendationDto } from "../types";

const mapContainerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
};

const center = {
    lat: 32.0853,
    lng: 34.7818
};

const NearbyPlaces: React.FC = () => {
    const [places, setPlaces] = useState<PlaceDto[]>([]);
    const [recommendations, setRecommendations] = useState<Record<number, RecommendationDto[]>>({});
    const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);
    const [hoveredPlace, setHoveredPlace] = useState<PlaceDto | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const mapRef = useRef<google.maps.Map | null>(null);

    const fetchPlaces = async (filters: any = {}) => {
        try {
            const allPlaces = await axios.get<PlaceDto[]>("/api/Place");
            let filtered = allPlaces.data;

            if (filters.categoryId) filtered = filtered.filter(p => p.categoryId === filters.categoryId);
            if (filters.countryId) {
                const cityRes = await axios.get(`/api/City`);
                const cities = cityRes.data.filter((c: any) => c.countryId === filters.countryId).map((c: any) => c.id);
                filtered = filtered.filter((p) => cities.includes(p.cityId));
            }
            if (filters.cityId) filtered = filtered.filter((p) => p.cityId === filters.cityId);

            setPlaces(filtered);

            const recs: Record<number, RecommendationDto[]> = {};
            await Promise.all(
                filtered.map(async (place) => {
                    const recRes = await axios.get(`/api/Recommendation/byPlace/${place.placeId}`);
                    recs[place.placeId] = recRes.data;
                })
            );
            setRecommendations(recs);
        } catch (err) {
            console.error("Error loading places or recommendations:", err);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            fetchPlaces({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        });
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>🌍 חיפוש מקומות במפה</h2>
            <button onClick={handleMyLocation}>📍 מצא אותי</button>
            <FilterPanel onFilterChange={fetchPlaces} />

            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    onIdle={() => {
                        const map = mapRef.current;
                        if (map) {
                            const center = map.getCenter();
                            if (center) {
                                fetchPlaces({ lat: center.lat(), lng: center.lng() });
                            }
                        }
                    }}
                >

                    {places.map((place) => (
                        <Marker
                            key={place.placeId}
                            position={{ lat: place.latitude, lng: place.longitude }}
                            onClick={() => {
                                setSelectedPlace(place);
                                setModalOpen(true);
                            }}
                            onMouseOver={() => setHoveredPlace(place)}
                            onMouseOut={() => setHoveredPlace(null)}
                        />
                    ))}

                    {hoveredPlace && (
                        <InfoWindow
                            position={{ lat: hoveredPlace.latitude, lng: hoveredPlace.longitude }}
                            onCloseClick={() => setHoveredPlace(null)}
                        >
                            <div>
                                <strong>{hoveredPlace.placeName}</strong>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </LoadScript>

            {modalOpen && selectedPlace && (
                <RecommendationModal
                    placeId={selectedPlace.placeId}
                    placeName={selectedPlace.placeName}
                    latitude={selectedPlace.latitude}
                    longitude={selectedPlace.longitude}
                    recommendations={recommendations[selectedPlace.placeId] || []}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default NearbyPlaces;
