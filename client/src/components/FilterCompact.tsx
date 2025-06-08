import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FilterCompact.css';

interface FilterProps {
  onApplyFilters: (filters: {
    countryId: number;
    cityId: number;
    categoryId: number;
    radius: number;
  }) => void;
}

const FilterCompact: React.FC<FilterProps> = ({ onApplyFilters }) => {
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
    const fetchData = async () => {
      const [countriesRes, categoriesRes, citiesRes] = await Promise.all([
        axios.get('https://localhost:7083/api/Country'),
        axios.get('https://localhost:7083/api/Category'),
        axios.get('https://localhost:7083/api/City'),
      ]);

      setCountries(countriesRes.data);
      setCategories(categoriesRes.data);
      setCities(citiesRes.data);
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleApply = () => {
    console.log('Applying filters:', filters);
    onApplyFilters(filters);
  };

  return (
    <div className="filter-compact">
      <select name="countryId" value={filters.countryId} onChange={handleFilterChange}>
        <option value={0}>🌐 מדינה</option>// אייקון
        {countries.map(country => (
          <option key={country.countryId} value={country.countryId}>{country.countryName}</option>
        ))}
      </select>

      <select name="cityId" value={filters.cityId} onChange={handleFilterChange}>
        <option value={0}>🏙️ עיר</option>//איייקון
        {cities
          .filter(city => !filters.countryId || city.countryId === filters.countryId)
          .map(city => (
            <option key={city.id} value={city.id}>{city.name}</option>
          ))}
      </select>

      <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
        <option value={0}>📌 קטגוריה</option>
        {categories.map(category => (
          <option key={category.categoryId} value={category.categoryId}>{category.name}</option>
        ))}
      </select>

      <input
        type="number"
        name="radius"
        placeholder='📍 רדיוס (ק"מ)'
        value={filters.radius || ''}
        onChange={handleFilterChange}
      />

      <button onClick={handleApply}>          <img src="/icons/edit.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
      </button>
    </div>
  );
};

export default FilterCompact;
