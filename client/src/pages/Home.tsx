import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";

interface Place {
  placeId: number;
  placeName: string;
  categoryId: number;
  cityId: number;
  latitude: number;
  longitude: number;
}

const Home = () => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    axios
      .get("https://localhost:7083/api/Place")
      .then((response) => {
        setPlaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="title">ברוכים הבאים ל-TrekOnTop</h1>
      <div className="placesGrid">
        {places.map((place) => (
          <div key={place.placeId} className="placeCard">
            <h3>{place.placeName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
