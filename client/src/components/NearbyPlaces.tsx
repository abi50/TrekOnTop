import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import RecommendationModal from "../components/RecommendationModal";
import FilterCompact from "../components/FilterCompact";
import { ImageDto, PlaceDto, RecommendationDto } from "../types";
import "../styles/NearbyPlaces.css";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "15px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
};

const defaultCenter = { lat: 32.0853, lng: 34.7818 };

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = ["places"];

const NearbyPlaces: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceDto[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDto | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<PlaceDto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [cities, setCities] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationDto[]>([]);
  const [images, setImages] = useState<ImageDto[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMountedRef = useRef(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  useEffect(() => {
    isMountedRef.current = true;
    fetchInitialData();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedPlace?.placeId) return;

    axios
      .get(`https://localhost:7083/api/Recommendation/byPlace/${selectedPlace.placeId}`)
      .then((res) => isMountedRef.current && setRecommendations(res.data))
      .catch(console.error);

    axios
      .get("https://localhost:7083/api/Image")
      .then((res) => {
        const allImages = res.data as ImageDto[];
        const relevant = allImages.filter((img) =>
          recommendations.some((rec) => rec.recoId === img.recommendationId)
        );
        if (isMountedRef.current) setImages(relevant);
      })
      .catch(console.error);
  }, [selectedPlace?.placeId]);

  const fetchInitialData = async () => {
    try {
      const [placesRes, citiesRes] = await Promise.all([
        axios.get("https://localhost:7083/api/Place"),
        axios.get("https://localhost:7083/api/City"),
      ]);

      if (!isMountedRef.current) return;

      setPlaces(placesRes.data);
      setFilteredPlaces(placesRes.data);
      setCities(citiesRes.data);
      console.log("טעינת מקומות ראשונית:", placesRes.data);
      centerMap(placesRes.data);
    } catch (err) {
      console.error("שגיאה בטעינת נתונים ראשונית:", err);
    }
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Applying filters:", filters);
    let filtered = [...places];

    if (filters.categoryId)
      filtered = filtered.filter((p) => p.categoryId === filters.categoryId);

    if (filters.countryId) {
      const filteredCities = cities
        .filter((c) => c.countryId === filters.countryId)
        .map((c) => c.id);
      filtered = filtered.filter((p) => filteredCities.includes(p.cityId));
    }

    if (filters.cityId)
      filtered = filtered.filter((p) => p.cityId === filters.cityId);

    if (filters.radius && filters.lat && filters.lng) {
      filtered = filtered.filter((p) => {
        const dist = getDistanceFromLatLng(filters.lat, filters.lng, p.latitude, p.longitude);
        return dist <= filters.radius;
      });
    }

    setFilteredPlaces(filtered);
    console.log("מקומות לאחר סינון:", filtered);
    centerMap(filtered);
  };

  const centerMap = (placesToCenter: PlaceDto[]) => {
    if (placesToCenter.length > 0) {
      const avgLat = placesToCenter.reduce((sum, p) => sum + p.latitude, 0) / placesToCenter.length;
      const avgLng = placesToCenter.reduce((sum, p) => sum + p.longitude, 0) / placesToCenter.length;

      setMapCenter({ lat: avgLat, lng: avgLng });
      console.log("מרכז מפה חדש:", { lat: avgLat, lng: avgLng });
    } else {
      setMapCenter(defaultCenter);
      console.log("אין מקומות לסינון, מרכז מפה לברירת מחדל");
    }
  };

  const getDistanceFromLatLng = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  if (!isLoaded) return <div>טוען מפה...</div>;

  return (
    <div className="nearby-places-container">
      <h2 className="title">🌍 חיפוש מקומות במפה</h2>

      <FilterCompact onApplyFilters={handleFiltersChange} />

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={8}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {filteredPlaces.map((place) => (
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

      {modalOpen && selectedPlace && (
        <RecommendationModal
          placeId={selectedPlace.placeId}
          placeName={selectedPlace.placeName}
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
          categoryId={selectedPlace.categoryId}
          recommendations={recommendations}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default NearbyPlaces;
