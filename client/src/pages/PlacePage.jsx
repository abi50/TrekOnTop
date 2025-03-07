
import "../styles/PlacePage.css";  
import React, { useState, useEffect } from "react";
import axios from "axios";

const PlacesPage = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");

    useEffect(() => {
        fetchPlaces();
        fetchCountries();
    }, []);

    const fetchPlaces = async (countryId = "") => {
        try {
            const url = countryId 
                ? `https://localhost:7083/api/Place/byCountry/${countryId}` 
                : `https://localhost:7083/api/Place`;
    
            const response = await axios.get(url);
            console.log("Places data:", response.data); // בדיקה בקונסול
            setPlaces(response.data);
            setFilteredPlaces(response.data);
        } catch (error) {
            console.error("Failed to fetch places:", error);
        }
    };
    

    const fetchCountries = async () => {
        try {
            const response = await axios.get("https://localhost:7083/api/Country");
            console.log("Countries data:", response.data); // בדיקה בקונסול
            setCountries(response.data); // שמירת רשימת המדינות כולל ID
        } catch (error) {
            console.error("Failed to fetch countries:", error);
        }
    };
    

    const handleFilterChange = (e) => {
        const selectedCountryName = e.target.value;
        setSelectedCountry(selectedCountryName);
    
        // מציאת ה-ID של המדינה שנבחרה
        const selectedCountry = countries.find(c => c.countryName === selectedCountryName);
        const countryId = selectedCountry ? selectedCountry.countryId : "";
    
        fetchPlaces(countryId); // קריאה לשרת עם ID של המדינה
    };
    

    return (
        <div className="container">
            <h1>Discover Beautiful Places</h1>
            <select onChange={handleFilterChange} className="dropdown">
                <option value="">All Countries</option>
                {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                ))}
            </select>

            <div className="grid-container">
                {filteredPlaces.map((place) => (
                    <div key={place.placeId} className="place-card">
                        {/* הצגת תמונה – אם אין, נטען תמונת ברירת מחדל */}
                        <img src={place.imageUrl || "https://via.placeholder.com/300"} alt={place.placeName} />
                        <h2>{place.placeName}</h2>
                        {/* הצגת מדינה – אם אין, יציג 'Unknown Country' */}
                        <p>{place.country || "Unknown Country"}</p>
                        <p>Latitude: {place.latitude}, Longitude: {place.longitude}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlacesPage;
