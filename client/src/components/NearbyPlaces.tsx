// 📁 NearbyPlaces.tsx
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import FilterPanel from "../components/FilterPanel";
import RecommendationModal from "../components/RecommendationModal";
import SmartSearchBar from "../components/SmartSearchBar";
import { PlaceDto, RecommendationDto } from "../types";
import "../styles/NearbyPlaces.css";

const mapContainerStyle = {
    width: "100%",
    height: "600px",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)"
};

const defaultCenter = {
    lat: 32.0853,
    lng: 34.7818
};

const NearbyPlaces: React.FC = () => {
    const [places, setPlaces] = useState<PlaceDto[]>([]);
    const [recommendations, setRecommendations] = useState<Record<number, RecommendationDto[]>>({});
    const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);
    const [hoveredPlace, setHoveredPlace] = useState<PlaceDto | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const mapRef = useRef<google.maps.Map | null>(null);
    
    
    useEffect(() => {
        setMapCenter(defaultCenter);
        fetchPlaces();
    }, []);
    const fetchPlaces = async (filters: any = {}) => {
        try {
            const allPlaces = await axios.get<PlaceDto[]>("https://localhost:7083/api/Place");
            let filtered = allPlaces.data;

            if (filters.categoryId) filtered = filtered.filter(p => p.categoryId === filters.categoryId);
            if (filters.countryId) {
                const cityRes = await axios.get("https://localhost:7083/api/City");
                const cities = cityRes.data.filter((c: any) => c.countryId === filters.countryId).map((c: any) => c.id);
                filtered = filtered.filter((p) => cities.includes(p.cityId));
            }
            if (filters.cityId) filtered = filtered.filter((p) => p.cityId === filters.cityId);

            if (filters.lat && filters.lng && filters.radiusKm) {
                filtered = filtered.filter(p => {
                    const dist = getDistanceFromLatLng(filters.lat, filters.lng, p.latitude, p.longitude);
                    return dist <= filters.radiusKm;
                });
                setMapCenter({ lat: filters.lat, lng: filters.lng });
            }

            if (filtered.length > 0) {
                const avgLat = filtered.reduce((sum, p) => sum + p.latitude, 0) / filtered.length;
                const avgLng = filtered.reduce((sum, p) => sum + p.longitude, 0) / filtered.length;
                setMapCenter({ lat: avgLat, lng: avgLng });
            }

            setPlaces(filtered);

            const recs: Record<number, RecommendationDto[]> = {};
            await Promise.all(
                filtered.map(async (place) => {
                    const recRes = await axios.get(`https://localhost:7083/api/Recommendation/byPlace/${place.placeId}`);
                    recs[place.placeId] = recRes.data;
                })
            );
            setRecommendations(recs);
        } catch (err) {
            console.error("Error loading places or recommendations:", err);
        }
    };

    const handleSmartSearch = async (parsed: { category: string, distanceKm: number, cityName: string }) => {
        console.log("🔍 קלט מהחיפוש החכם:", parsed);
      
        try {
           
          const cityRes = await axios.get("https://localhost:7083/api/City");
          const match = cityRes.data.find((c: any) =>
            c.name.toLowerCase().includes(parsed.cityName.toLowerCase())
          );
      
          if (!match) {
            
            console.warn("⚠️ עיר לא נמצאה במסד הנתונים:", parsed.cityName);
            alert(`לא נמצאה עיר בשם "${parsed.cityName}". נסה לכתוב שם אחר.`);
            return;
          }
          let lat = match.latitude;
          let lng = match.longitude;
      
          if (!lat || !lng) {
            console.log("📡 מבצע Geocoding דרך גוגל לעיר:", match.name);
            
        }
      
          const categoryRes = await axios.get("https://localhost:7083/api/Category");
          const cat = categoryRes.data.find((c: any) =>
            c.name.toLowerCase().includes(parsed.category.toLowerCase())
          );
      
          if (!cat) {
            console.warn("⚠️ קטגוריה לא נמצאה במסד הנתונים:", parsed.category);
            alert(`לא נמצאה קטגוריה בשם "${parsed.category}". נסה לכתוב קטגוריה שונה.`);
            return;
          }
      
          const filters = {
            lat: match.latitude,
            lng: match.longitude,
            radiusKm: parsed.distanceKm,
            categoryId: cat.categoryId
          };
      
          console.log("📍 מבצע חיפוש עם סינון:", filters);
          fetchPlaces(filters);
      
        } catch (err) {
          console.error("❌ שגיאה בביצוע חיפוש חכם:", err);
          alert("אירעה שגיאה בעת ניסיון לבצע חיפוש חכם. נסה שוב.");
        }
      };
      

    const getDistanceFromLatLng = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const toRad = (x: number) => x * Math.PI / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            console.log("Found location:", pos.coords);
            const { latitude, longitude } = pos.coords;
            setMapCenter({ lat: latitude, lng: longitude });
            fetchPlaces({ lat: latitude, lng: longitude });
            console.log("Map ref:", mapRef.current);
        }, (err) => {
            console.error("שגיאה במציאת מיקום:", err);
        });
    };

    return (
        <div className="nearby-places-container">
            <h2 className="title">🌍 חיפוש מקומות במפה</h2>
            <button onClick={handleMyLocation} className="mylocation-btn">📍 מצא אותי</button>

            <div className="filters-container">
                <div className="smart-search-section">
                    <SmartSearchBar onSearchParsed={handleSmartSearch} />
                </div>
                <div className="filter-panel-section">
                    <FilterPanel onFilterChange={fetchPlaces} />
                </div>
            </div>



            <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={5}
                    onLoad={(map) => { mapRef.current = map; }}
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
                    categoryId={selectedPlace.categoryId} // ✅ הוספת השדה החסר
                    recommendations={recommendations[selectedPlace.placeId] || []}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </div>
    );
};

export default NearbyPlaces;
