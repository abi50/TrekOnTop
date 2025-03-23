import React, { useState, useRef } from "react";
import { LoadScript, GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import { Libraries } from "@react-google-maps/api";

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
  }) => void;
}

const GoogleMapSearch: React.FC<GoogleMapSearchProps> = ({ onPlaceSelected }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handlePlaceSelect = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.address_components) return; // בדיקה נוספת

    const countryComponent = place.address_components.find((comp) =>
      comp.types.includes("country")
    );
    const selectedPlace = {
      name: place.name || "Unknown",
      address: place.formatted_address || "Unknown address",
      lat: place.geometry.location?.lat() || 0,
      lng: place.geometry.location?.lng() || 0,
      city: place.address_components?.find((comp) => comp.types.includes("locality"))?.long_name || "Unknown", // שם העיר
      country: countryComponent?.long_name || "Unknown", // שם המדינה
      countryCode: countryComponent?.short_name || "XX", 
    };
    console.log(selectedPlace);
    setPosition({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    onPlaceSelected(selectedPlace);

    if (map) {
      map.panTo({ lat: selectedPlace.lat, lng: selectedPlace.lng });
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""} libraries={libraries}>
      <div style={{ marginBottom: "10px" }}>
        <Autocomplete onLoad={(auto) => (autocompleteRef.current = auto)} onPlaceChanged={handlePlaceSelect}>
          <input type="text" placeholder="Search for a place..." style={{ width: "300px", padding: "10px", fontSize: "16px" }} />
        </Autocomplete>
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
