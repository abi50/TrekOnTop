import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";
import PlaceCard from "../components/PlaceCard";
import { useSearch } from "../context/SearchContext";
import { PlaceDto, CategoryDto, CountryDto } from "../types";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const { searchQuery } = useSearch();

  // Fetch places, categories, and countries
  useEffect(() => {
    axios.get("https://localhost:7083/api/Place")
      .then(response => {
        setPlaces(response.data);
      })
      .catch(error => console.error("Error fetching places:", error));

    axios.get("https://localhost:7083/api/Category")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => console.error("Error fetching categories:", error));

    axios.get("https://localhost:7083/api/Country")
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => console.error("Error fetching countries:", error));
  }, []);

  // Filter places based on search query, category, and country
  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.placeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? place.categoryId === selectedCategory : true;
    const matchesCountry = selectedCountry ? place.cityId === selectedCountry : true;

    return matchesSearch && matchesCategory && matchesCountry;
  });

  return (
    <div className="home-container">
      <h1>🌎 מקומות מומלצים</h1>
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
          <p>לא נמצאו מקומות שמתאימים לחיפוש שלך.</p>
        )}
      </div>

    </div>
  );
};

export default Home;
