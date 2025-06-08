// AddRecommendation.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../reduxs/store';
import {
  setLatitudeLongitude,
  setPlaceName,
  setCityName,
  setCountryName,
  setCountryCode,
  setTitle,
  setDescription,
  setCategoryId,
  addFile,
  clearForm,
} from '../reduxs/recommendationFormSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleMapSearch from './Search';
import '../styles/AddRecommendation.css';
import { CategoryDto } from '../types';

const AddRecommendation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useSelector((state: RootState) => state.recommendation);
  const token = localStorage.getItem('token');
  const user = useSelector((state: RootState) => state.user);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem("recommendationDraft", JSON.stringify(form));
    }, 500);
    return () => clearInterval(interval);
  }, [form]);

  useEffect(() => {
    const saved = localStorage.getItem("recommendationDraft");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch(setTitle(parsed.title));
      dispatch(setDescription(parsed.description));
      dispatch(setCityName(parsed.cityName));
      dispatch(setCountryName(parsed.countryName));
      dispatch(setCountryCode(parsed.countryCode));
      dispatch(setLatitudeLongitude({ latitude: parsed.latitude, longitude: parsed.longitude }));
      dispatch(setCategoryId(parsed.categoryId));
    }
  }, []);

  useEffect(() => {
    const place = localStorage.getItem("selectedPlace");
    if (place) {
      try {
        const parsed = JSON.parse(place);
        dispatch(setPlaceName(parsed.placeName));
        dispatch(setLatitudeLongitude({ latitude: parsed.latitude, longitude: parsed.longitude }));
        dispatch(setCityName(parsed.cityName || ""));
        dispatch(setCountryName(parsed.countryName || ""));
        dispatch(setCountryCode(parsed.countryCode || ""));
        dispatch(setCategoryId(parsed.categoryId || 0));
        handlePlaceSelected({
          name: parsed.placeName,
          address: "",
          lat: parsed.latitude,
          lng: parsed.longitude,
          city: parsed.cityName || "",
          country: parsed.countryName || "",
          countryCode: parsed.countryCode || ""
        });
      } catch (err) {
        console.error("Couldn't parse selectedPlace:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) navigate('/auth');
  }, [token, navigate]);

  useEffect(() => {
    axios.get("https://localhost:7083/api/Category")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handlePlaceSelected = (place: { name: string; address: string; lat: number; lng: number; city?: string; country?: string; countryCode?: string }) => {
    dispatch(setPlaceName(place.name));
    dispatch(setLatitudeLongitude({ latitude: place.lat, longitude: place.lng }));
    dispatch(setCityName(place.city || ""));
    dispatch(setCountryName(place.country || ""));
    dispatch(setCountryCode(place.countryCode || ""));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/addReco");
      alert("עליך להתחבר או להירשם כדי להוסיף המלצה");
      navigate("/login");
      return;
    }
  
    try {
      let placeId;
  
      console.log("בדיקת קיום המקום");
      try {
        const placeRes = await axios.get(`https://localhost:7083/api/Place/checkIfPlaceExists`, {
          params: { lat: form.latitude, lng: form.longitude },
        });
        placeId = placeRes.data.placeId;
      } catch {
        console.log("המקום לא קיים, ממשיכים לבדוק עיר");
        let cityId;
  
        try {
          const cityRes = await axios.get(`https://localhost:7083/api/City/byName`, {
            params: { cityName: form.cityName },
          });
          cityId = cityRes.data.id;
        } catch {
          console.log("העיר לא קיימת, ממשיכים לבדוק מדינה");
          let countryId;
  
          try {
            const countryRes = await axios.get(`https://localhost:7083/api/Country/byName`, {
              params: { countryCode: form.countryCode },
            });
            countryId = countryRes.data.countryId;
          } catch {
            console.log("המדינה לא קיימת, יוצרים מדינה חדשה");
  
            const countryForm = new FormData();
            countryForm.append("CountryName", form.countryName);
            countryForm.append("CountryCode", form.countryCode);
  
            const newCountryRes = await axios.post(`https://localhost:7083/api/Country`, countryForm, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            countryId = newCountryRes.data.countryId;
          }
  
          console.log("עכשיו יוצרים עיר חדשה");
          const cityForm = new FormData();
          cityForm.append("Name", form.cityName);
          cityForm.append("CountryId", countryId.toString());
  
          const newCityRes = await axios.post(`https://localhost:7083/api/City`, cityForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          cityId = newCityRes.data.id;
        }
  
        console.log("עכשיו יוצרים מקום חדש");
        const newPlaceRes = await axios.post(`https://localhost:7083/api/Place`, {
          PlaceName: form.placeName,
          Latitude: form.latitude,
          Longitude: form.longitude,
          CategoryId: form.categoryId,
          CityId: cityId,
        }, {
          headers: { 'Content-Type': 'application/json' },
        });
        placeId = newPlaceRes.data.placeId;
      }
  
      console.log("עכשיו יוצרים המלצה");
      const recommendationData = new FormData();
      recommendationData.append('RecoId', '0');
      recommendationData.append('UserId', user.user?.id?.toString() || '0');
      recommendationData.append('Title', form.title);
      recommendationData.append('Description', form.description);
      recommendationData.append('Likes', '0');
      recommendationData.append('Dislikes', '0');
      recommendationData.append('PlaceId', placeId.toString());
  
      const recoResponse = await axios.post('https://localhost:7083/api/Recommendation', recommendationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      const recoId = recoResponse.data.recoId;
  
      // שליחת תמונות
      if (form.files.length > 0) {
        for (const file of form.files) {
          const imgData = new FormData();
          imgData.append("RecommendationId", recoId.toString());
          imgData.append("File", file);
          await axios.post('https://localhost:7083/api/Image', imgData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }
  
      dispatch(clearForm());
      localStorage.removeItem("recommendationDraft");
      localStorage.removeItem("selectedPlace");
      navigate(`/`);
  
    } catch (error) {
      console.error("שגיאה בהעלאת ההמלצה:", error);
      alert("אירעה שגיאה בעת שליחת ההמלצה. בדקי את הקונסול לפרטים.");
    }
  };
  

  return (
    <div className="container">
      <h2>העלאת המלצה חדשה</h2>
      <form onSubmit={handleSubmit}>
        <GoogleMapSearch
          onPlaceSelected={handlePlaceSelected}
          initialPosition={form.latitude && form.longitude ? { lat: form.latitude, lng: form.longitude } : undefined}
          initialPlaceName={form.placeName}
        />
        <select value={form.categoryId || ''} onChange={e => dispatch(setCategoryId(Number(e.target.value)))} required>
          <option value="">בחר קטגוריה</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
          ))}
        </select>
        <input type="text" placeholder="כותרת ההמלצה" value={form.title} onChange={e => dispatch(setTitle(e.target.value))} required />
        <textarea placeholder="תיאור מפורט" value={form.description} onChange={e => dispatch(setDescription(e.target.value))} required />
        <input type="file" multiple onChange={e => {
          const files = e.target.files;
          if (files) {
            for (let i = 0; i < files.length; i++) {
              dispatch(addFile(files[i]));
            }
          }
        }}  />
        <button type="submit">שלח המלצה</button>
      </form>
    </div>
  );
};

export default AddRecommendation;