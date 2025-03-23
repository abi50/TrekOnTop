
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
import GoogleMapSearch from './Search'; // ייבוא המפה החדשה
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
    localStorage.setItem("recommendationDraft", JSON.stringify(form));
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
      // קובץ אי אפשר לשחזר, אבל שדות טקסט ומספרים כן
    }
  }, []);


  useEffect(() => {
    if (!token) navigate('/register');
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
  const checkIfPlaceExists = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Place/checkIfPlaceExists`, {
        params: { lat: latitude, lng: longitude }
      });
      console.log(response.data);
      return { placeId: response.data.placeId }; // מחזיר את מזהה המקום אם נמצא

    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        return null; // מקום לא נמצא במסד הנתונים
      }
      console.error("Error checking if place exists:", error);
      return null; // במקרה של שגיאה אחרת
    }
  };
  const checkIfCityExists = async (cityName: string) => {
    try {
      const response = await axios.get(`https://localhost:7083/api/City/byName`, {
        params: { cityName: cityName }
      });

      return { cityId: response.data }; // מחזיר את מזהה המקום אם נמצא

    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        return null; // מקום לא נמצא במסד הנתונים
      }
      console.error("Error checking if city exists:", error);
      return null; // במקרה של שגיאה אחרת
    }
  };
  const checkIfCountryExists = async (CountryCode: string) => {
    try {
      const response = await axios.get(`https://localhost:7083/api/Country/byName`, {
        params: { countryCode: CountryCode }
      });

      return { countryId: response.data }; // מחזיר את מזהה המקום אם נמצא

    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
        return null; // מקום לא נמצא במסד הנתונים
      }
      console.error("Error checking if country exists:", error);
      return null; // במקרה של שגיאה אחרת
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (!token) {
        localStorage.setItem("redirectAfterLogin", "/addReco");
        alert("עליך להתחבר או להירשם כדי להוסיף המלצה");
        navigate("/login");
      }


    try {
      // 1️⃣ בדיקת קיום המקום במסד הנתונים
      let placeId: number | null = null;
      console.log(form.latitude);
      console.log(form.longitude);

      const placeExists = await checkIfPlaceExists(form.latitude ?? 0, form.longitude ?? 0);
      if (placeExists) {
        console.log(`placeExists: ${placeExists}`);
        placeId = placeExists.placeId;
        console.log(`Place exists with ID: ${placeId}`);
      } else {
        console.log("Place does not exist, checking city and country...");
        let cityId: number | null = null;
        console.log(form.cityName);

        const cityExists = await checkIfCityExists(form.cityName);
        if (cityExists) {
          console.log(cityExists);
          cityId = cityExists.cityId.id;
          console.log(`city exists with ID: ${cityId}`);
        } else {
          console.log("City does not exist, creating new city...");
          console.log("checking country...");
          let countryId: number | null = null;
          console.log(form.countryName);
          console.log(form.countryCode);

          const CountryExists = await checkIfCountryExists(form.countryCode);
          if (CountryExists) {
            console.log(CountryExists);
            countryId = CountryExists.countryId.countryId;
            console.log(`country exists with ID: ${countryId}`);
          } else {
            console.log("Country does not exist, creating new country...");
            try {
              const countryData = { CountryName: form.countryName, CountryCode: form.countryCode };
              const newCountryResponse = await axios.post('https://localhost:7083/api/Country', countryData, {
                headers: { Authorization: `Bearer ${token}` }
              });
              countryId = newCountryResponse.data.countryId;
              console.log(newCountryResponse.data);
              console.log(`New country created with ID: ${countryId}`);
            } catch (err) {
              console.error("Error creating country:", err);
              return;
            }
          }

          console.log("creating new city...");
          try {
            const cityData = new FormData();
            cityData.append("Name", form.cityName);
            cityData.append("CountryId", countryId?.toString() || '');

            const newCityResponse = await axios.post('https://localhost:7083/api/City', cityData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            });

            cityId = newCityResponse.data.id;
            console.log(`New city created with ID: ${cityId}`);
          } catch (err) {
            console.error("Error creating city:", err);
            return;
          }
        }

        // 4️⃣ יצירת מקום חדש
        console.log("Creating new place...");
        const placeData = {
          PlaceName: form.placeName,
          CategoryId: form.categoryId,
          CityId: cityId,
          Latitude: form.latitude,
          Longitude: form.longitude
        };
        console.log(placeData);
        try {
          const placeResponse = await axios.post('https://localhost:7083/api/Place', placeData, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(placeResponse.data);
          placeId = placeResponse.data.placeId;
          console.log(`New place created with ID: ${placeId}`);
        } catch (err) {
          console.error("Error creating place:", err);
          return;
        }
      }
      console.log(user);

      // 5️⃣ יצירת המלצה חדשה
      const recommendationData = new FormData();
      recommendationData.append('RecoId', '0');
      recommendationData.append('UserId', user.user?.id?.toString() || '34');
      recommendationData.append('PlaceId', placeId?.toString() || '');
      recommendationData.append('Title', form.title);
      recommendationData.append('Description', form.description);
      recommendationData.append('Likes', '0');
      recommendationData.append('Dislikes', '0');
      // form.files.forEach(file => recommendationData.append('Files', file));

      console.log("Submitting recommendation...");
      console.log("Token being sent:", token);
      console.log("FormData being sent:");
      Array.from(recommendationData.entries()).forEach(pair => {
        console.log(pair[0] + ': ' + pair[1]);
      });

      try {
        await axios.post('https://localhost:7083/api/Recommendation', recommendationData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Recommendation submitted successfully!");
        dispatch(clearForm());
        
      } catch (err) {
        console.error("Error creating recommendation:", err);
      }

    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };


  return (
    <div className="container">
      <h2>העלאת המלצה חדשה</h2>
      <form onSubmit={handleSubmit}>
        {/* חיפוש מקום באמצעות GoogleMapSearch */}
        <GoogleMapSearch onPlaceSelected={handlePlaceSelected} />

        <select value={form.categoryId || ''} onChange={e => dispatch(setCategoryId(Number(e.target.value)))} required>
          <option value="">בחר קטגוריה</option>
          {categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
          ))}
        </select>

        <input type="text" placeholder="כותרת ההמלצה" value={form.title} onChange={e => dispatch(setTitle(e.target.value))} required />
        <textarea placeholder="תיאור מפורט" value={form.description} onChange={e => dispatch(setDescription(e.target.value))} required />
        <input type="file" onChange={e => dispatch(addFile(e.target.files![0]))} required />
        <button type="submit">שלח המלצה</button>
      </form>
    </div>
  );
};

export default AddRecommendation;
