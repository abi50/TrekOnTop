import React, { useState, useRef, useEffect } from "react";
import { LoadScript, GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api";
import axios from "axios";

const libraries: Libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "500px" };
const center = { lat: 40.73061, lng: -73.935242 }; // ניו יורק כברירת מחדל

interface GoogleMapSearchProps {
  onPlaceSelected: (place: {
    name: string;
    address: string;
    lat: number;
    lng: number;
    city: string;
    country?: string;
    countryCode?: string;
  }) => void;
  initialPosition?: { lat: number; lng: number };
  initialPlaceName?: string;
  
}

const GoogleMapSearch: React.FC<GoogleMapSearchProps> = ({ onPlaceSelected, initialPosition, initialPlaceName }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hasRecommendation, setHasRecommendation] = useState<boolean>(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState(""); // ערך שמופיע בשדה החיפוש

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition);
      if (map) {
        map.panTo(initialPosition);
      }
    }
    if (initialPlaceName) {
      setInputValue(initialPlaceName);
    }
    
  }, [initialPosition, map]);

  const handlePlaceSelect = async () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.address_components) return;

    const countryComponent = place.address_components.find((comp) =>
      comp.types.includes("country")
    );

    setInputValue(place.name || "");

    const selectedPlace = {
      name: place.name || "Unknown",
      address: place.formatted_address || "Unknown address",
      lat: place.geometry.location?.lat() || 0,
      lng: place.geometry.location?.lng() || 0,
      city: place.address_components?.find((comp) => comp.types.includes("locality"))?.long_name || "Unknown",
      country: countryComponent?.long_name || "Unknown",
      countryCode: countryComponent?.short_name || "XX",
    };

    console.log(selectedPlace);
    setPosition({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    onPlaceSelected(selectedPlace);

    if (map) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    }

    try {
      const response = await axios.get(`https://localhost:7083/api/Place/checkIfPlaceExists`, {
        params: { lat: selectedPlace.lat, lng: selectedPlace.lng }
      });

      const placeId = response.data.placeId;
      const recoRes = await axios.get(`https://localhost:7083/api/Recommendation/byPlace/${placeId}`);
      if (Array.isArray(recoRes.data) && recoRes.data.length > 0) {
        setHasRecommendation(true);
      } else {
        setHasRecommendation(false);
      }
    } catch (error) {
      console.log("No recommendation found or error:", error);
      setHasRecommendation(false);
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""} libraries={libraries}>
      <div style={{ marginBottom: "10px" }}>
        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="חפש מקום..."
            style={{ width: "300px", padding: "10px", fontSize: "16px" }}
          />

        </Autocomplete>
        {hasRecommendation && (
          <div style={{ color: "green", fontSize: "14px", marginTop: "5px" }}>
            ⭐ יש כבר המלצות על המקום הזה!
          </div>
        )}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={position || center}
        zoom={12}
        onLoad={(map) => setMap(map)}
      >
        {position && <Marker position={position} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapSearch;
