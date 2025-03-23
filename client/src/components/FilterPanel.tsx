import React, { useEffect, useState } from "react";
import axios from "axios";
import { CategoryDto, CountryDto, CityDto } from "../types";

interface FilterProps {
  onFilterChange: (filters: {
    categoryId?: number;
    countryId?: number;
    cityId?: number;
  }) => void;
}

const FilterPanel: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [countries, setCountries] = useState<CountryDto[]>([]);
  const [cities, setCities] = useState<CityDto[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | undefined>();

  useEffect(() => {
    axios.get("/api/Category").then((res) => setCategories(res.data));
    axios.get("/api/Country").then((res) => setCountries(res.data));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`/api/City`)
        .then((res) => setCities(res.data.filter((c: CityDto) => c.countryId === selectedCountry)));
    } else {
      setCities([]);
    }
  }, [selectedCountry]);

  return (
    <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 10, marginBottom: 20 }}>
      <label>
        קטגוריה:
        <select onChange={(e) => onFilterChange({ categoryId: Number(e.target.value) })}>
          <option value="">הכל</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        מדינה:
        <select onChange={(e) => {
          const id = Number(e.target.value);
          setSelectedCountry(id);
          onFilterChange({ countryId: id });
        }}>
          <option value="">הכל</option>
          {countries.map((country) => (
            <option key={country.countryId} value={country.countryId}>
              {country.countryName}
            </option>
          ))}
        </select>
      </label>
      <label>
        עיר:
        <select onChange={(e) => onFilterChange({ cityId: Number(e.target.value) })}>
          <option value="">הכל</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterPanel;
