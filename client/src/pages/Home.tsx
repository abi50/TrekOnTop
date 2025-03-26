import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "../components/PlaceCard";
import { PlaceDto, CategoryDto, CountryDto } from "../types";
import "../styles/Home.css";

const Home: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("https://localhost:7083/api/Place/paged", {
      params: { page: 1, limit: 6 }
    })
      .then(response => {
        setPlaces(response.data);
        setPage(2);
      })
      .catch(error => console.error("Error fetching places:", error));

    axios.get("https://localhost:7083/api/Category")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));

    axios.get("https://localhost:7083/api/Country")
      .then(response => setCountries(response.data))
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading && hasMore
      ) {
        fetchMorePlaces();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const fetchMorePlaces = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get("https://localhost:7083/api/Place/paged", {
        params: { page, limit: 6 }
      });
      const newPlaces = res.data;

      if (newPlaces.length === 0) {
        setHasMore(false);
      } else {
        setPlaces(prev => [...prev, ...newPlaces]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching more places:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesCategory = selectedCategory ? place.categoryId === selectedCategory : true;
    const matchesCountry = selectedCountry ? place.cityId === selectedCountry : true;
    return matchesCategory && matchesCountry;
  });

  return (
    <div className="home-container">
      <h1>🌍 מקומות מומלצים</h1>

      <div className="filters-container">
        <div className="filter">
          <h3>סנן לפי קטגוריה</h3>
          <select onChange={(e) => setSelectedCategory(Number(e.target.value))} defaultValue="">
            <option value="">בחר קטגוריה</option>
            {categories.map(category => (
              <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="filter">
          <h3>סנן לפי מדינה</h3>
          <select onChange={(e) => setSelectedCountry(Number(e.target.value))} defaultValue="">
            <option value="">בחר מדינה</option>
            {countries.map(country => (
              <option key={country.countryId} value={country.countryId}>{country.countryName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="places-container">
        {filteredPlaces.length > 0 ? (
          filteredPlaces.map(place => (
            <PlaceCard key={place.placeId} place={place} />
          ))
        ) : (
          <p>לא נמצאו מקומות מתאימים.</p>
        )}
      </div>

      {loading && <p style={{ textAlign: "center" }}>🔄 טוען מקומות נוספים...</p>}
    </div>
  );
};

export default Home;
