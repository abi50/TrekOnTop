import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlaceCard from '../components/PlaceCard';
import '../styles/PlacesPage.css';
import FilterCompact from '../components/FilterCompact';


interface PlaceDto {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  countryId: number;
  cityId: number;
}

const PlacesPage: React.FC = () => {
  const [places, setPlaces] = useState<PlaceDto[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<PlaceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    categoryId: 0,
    countryId: 0,
    cityId: 0,
    radius: 0,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [placesRes, countriesRes, categoriesRes, citiesRes] = await Promise.all([
        axios.get('https://localhost:7083/api/Place'),
        axios.get('https://localhost:7083/api/Country'),
        axios.get('https://localhost:7083/api/Category'),
        axios.get('https://localhost:7083/api/City'),
      ]);

      setPlaces(placesRes.data);
      setFilteredPlaces(placesRes.data);
      setCountries(countriesRes.data);
      setCategories(categoriesRes.data);
      setCities(citiesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 
  const applyFilters = (filters: {
    categoryId: number;
    countryId: number;
    cityId: number;
    radius: number;
  }) => {
    console.log("Applying filters:", filters);
    let result = places;
console.log("Initial places:", result);
    if (filters.categoryId)
      result = result.filter(p => p.categoryId === filters.categoryId);

    if (filters.countryId)
        result = result.filter(p => {
          const city = cities.find(c => c.id === p.cityId);
          return city?.countryId === filters.countryId;
        });

    if (filters.cityId)
      result = result.filter(p => p.cityId === filters.cityId);

    setFilteredPlaces(result);
  };

  const resetFilters = () => {
    setFilteredPlaces(places);
  };
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: Number(value) }));
  };
  return (
    <div className="places-page-container">
    <h1 className="places-page-title">        <img src="/icons/earth.png" alt="popular places" style={{ width: 36, verticalAlign: 'middle', marginLeft: 5 }} />
    גלה מקומות מדהימים</h1>
    <FilterCompact onApplyFilters={applyFilters} />
      <button className="reset-filters-btn" onClick={resetFilters}>איפוס סינונים</button>

    {loading && <div className="loading">טוען מקומות...</div>}

    <div className="places-grid">
      {filteredPlaces.length > 0 ? (
        filteredPlaces.map(place => <PlaceCard key={place.placeId} place={place} />)
      ) : (
        <div className="no-results">לא נמצאו מקומות שתואמים לסינון שלך.</div>
      )}
    </div>
  </div>
  );
};

export default PlacesPage;
