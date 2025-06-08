import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import PlaceCard from "../components/PlaceCard";
import RecommendationCard from "../components/RecommendationCard";
import { PlaceDto, RecommendationDto, CountryDto } from "../types";

const Home: React.FC = () => {
  const [topPlaces, setTopPlaces] = useState<PlaceDto[]>([]);
  const [topCountries, setTopCountries] = useState<CountryDto[]>([]);
  const [recentRecommendations, setRecentRecommendations] = useState<RecommendationDto[]>([]);
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    // מקומות עם הכי הרבה המלצות
    console.log("start fetching");
    axios.get("https://localhost:7083/api/Place/topWithMostRecommendations")
      .then(res => setTopPlaces(res.data))
      .catch(console.error);

    // מדינות עם הכי הרבה מקומות
    axios.get("https://localhost:7083/api/Country/mostPopular")
      .then(res => setTopCountries(res.data))
      .catch(console.error);

    // המלצות אקראיות
    axios.get("https://localhost:7083/api/Recommendation/random?count=4")
      .then(res => setRecentRecommendations(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="homepage-wrapper">
      <div className="hero-banner">
        <div className="hero-text">
          <h1>הטיול הבא שלך מתחיל כאן</h1>
          <p>המלצות אמיתיות ממטיילים על מקומות מרהיבים בעולם</p>
        </div>
      </div>

      <div className="home-section">
      </div>

      <div className="home-section">
        <h2>
          <img src="/icons/push-pin.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
          מקומות פופולריים
        </h2>        <div className="places-grid">
          {topPlaces.map(place => <PlaceCard key={place.placeId} place={place} />)}
        </div>
      </div>

      <div className="home-section">
        <h2>
        <img src="/icons/europe.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
        
           מדינות בולטות</h2>
        <div className="country-tags">
          {topCountries.map(country => (
            <div key={country.countryId} className="country-tag">
              {country.countryName}
            </div>
          ))}
        </div>
      </div>

      <div className="home-section">
        <h2>
        <img src="/icons/edit.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />

           המלצות אחרונות</h2>
        <div className="recommendations-grid">
          {recentRecommendations.map(rec => (

            <RecommendationCard recoId={rec.recoId}
              title={rec.title}
              description={rec.description}
              likes={rec.likes}
              dislikes={rec.dislikes}
              token={token} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
