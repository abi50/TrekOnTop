import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import PlaceCard from "../components/PlaceCard";

interface PlaceDto {
  placeId: number;
  placeName: string;
  categoryId: number;
  cityId: number;
  latitude: number;
  longitude: number;
}

const Home: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDto[]>([]);

  useEffect(() => {
    axios.get("https://localhost:7083/api/Place")
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => console.error("Error fetching places:", error));
  }, []);

  return (
    <div className="home-container">
      <h1>🌎 מקומות מומלצים</h1>
      <div className="places-container">
        {places.map(place => (
          <PlaceCard key={place.placeId} place={place} />
        ))}
      </div>
    </div>
  );
};

export default Home;
