import React, { useEffect, useState } from "react";
import { RecommendationDto } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RecommendationModal.css";
// אייקונים
import likeBefore from '../assets/likes/like_before.png';
import likeLoading from '../assets/likes/like_loading.gif';
import likeAfter from '../assets/likes/like_after.png';

import dislikeBefore from '../assets/likes/dislike_before.png';
import dislikeLoading from '../assets/likes/dislike_loading.gif';
import dislikeAfter from '../assets/likes/dislike_after.png';


interface Props {
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
  categoryId: number;
  recommendations: RecommendationDto[];
  onClose: () => void;
}

interface GooglePlaceDetails {
  name: string;
  address: string;
  photos: string[];
  website?: string;
  rating?: number;
  user_ratings_total?: number;
}


const RecommendationModal: React.FC<Props> = ({
  placeId,
  placeName,
  latitude,
  longitude,
  categoryId,
  recommendations,
  onClose
}) => {
  const navigate = useNavigate();
  const [details, setDetails] = useState<GooglePlaceDetails | null>(null);
  const token = localStorage.getItem('token');
  const [usersByReco, setUsersByReco] = useState<Record<number, any>>({});
  const [likeStateMap, setLikeStateMap] = useState<Record<number, "none" | "loading" | "liked">>({});
  const [dislikeStateMap, setDislikeStateMap] = useState<Record<number, "none" | "loading" | "disliked">>({});
  const [counts, setCounts] = useState<Record<number, { likes: number; dislikes: number }>>({});
  const [bumpMap, setBumpMap] = useState<Record<number, { like: boolean; dislike: boolean }>>({});
  const [imagesByReco, setImagesByReco] = useState<Record<number, any[]>>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});

  useEffect(() => {
    recommendations.forEach((reco) => {
      setCounts(prev => ({ ...prev, [reco.recoId]: { likes: reco.likes, dislikes: reco.dislikes } }));
      setBumpMap(prev => ({ ...prev, [reco.recoId]: { like: false, dislike: false } }));
      axios.get(`https://localhost:7083/api/RecommendationLike/status/${reco.recoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => {
        const status = res.data.status;
        setLikeStateMap(prev => ({ ...prev, [reco.recoId]: status === 'liked' ? 'liked' : 'none' }));
        setDislikeStateMap(prev => ({ ...prev, [reco.recoId]: status === 'disliked' ? 'disliked' : 'none' }));
      }).catch(console.error);
    });
  }, [recommendations, token]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userMap: Record<number, any> = {};
        await Promise.all(recommendations.map(async (reco) => {
          const res = await axios.get(`https://localhost:7083/api/Recommendation/${reco.recoId}/user`);
          userMap[reco.recoId] = res.data;
        }));
        setUsersByReco(userMap);
      } catch (err) {
        console.error("שגיאה בטעינת משתמשים להמלצות:", err);
      }
    };

    if (recommendations.length > 0) {
      fetchUsers();
    }
  }, [recommendations]);

  useEffect(() => {
    const fetchImages = async () => {
      const imageMap: Record<number, any[]> = {};
      const imageIndexMap: Record<number, number> = {};

      await Promise.all(recommendations.map(async (rec: any) => {
        try {
          const imgRes = await axios.get(`https://localhost:7083/api/Recommendation/${rec.recoId}/images`);
          imageMap[rec.recoId] = imgRes.data;
          imageIndexMap[rec.recoId] = 0;
        } catch (e) {
          imageMap[rec.recoId] = [];
          imageIndexMap[rec.recoId] = 0;
        }
      }));

      setImagesByReco(imageMap);
      setCurrentImageIndex(imageIndexMap);
    };

    fetchImages();
  }, [recommendations]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => {
        const updated: Record<number, number> = { ...prev };
        for (const recoId in imagesByReco) {
          const images = imagesByReco[recoId];
          if (images && images.length > 1) {
            updated[recoId] = (prev[recoId] + 1) % images.length;
          }
        }
        return updated;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [imagesByReco]);

  useEffect(() => {
    const fetchGooglePlaceDetails = async () => {
      try {
        const res = await axios.get("https://localhost:7083/api/GooglePlaces/searchByText", {
          params: { query: `${placeName}, ${latitude}, ${longitude}` }
        });
        const place = res.data.results[0];
        if (place) {
          const detailsRes = await axios.get("https://localhost:7083/api/GooglePlaces/details", {
            params: { placeId: place.place_id }
          });

          const d = detailsRes.data.result;
          const photos = d.photos?.map((p: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          ) || [];

          setDetails({
            name: d.name,
            address: d.formatted_address,
            photos,
            website: d.website,
            rating: d.rating,
            user_ratings_total: d.user_ratings_total
          });
        }
      } catch (err) {
        console.error("Failed to fetch Google place details", err);
      }
    };
    fetchGooglePlaceDetails();
  }, [latitude, longitude]);

  const handleLike = async (recoId: number) => {
    if (likeStateMap[recoId] === 'liked') return;
    setLikeStateMap(prev => ({ ...prev, [recoId]: 'loading' }));
    try {
      await axios.post(`https://localhost:7083/api/RecommendationLike/Like/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(() => {
        setLikeStateMap(prev => ({ ...prev, [recoId]: 'liked' }));
        setDislikeStateMap(prev => ({ ...prev, [recoId]: 'none' }));
        setCounts(prev => ({
          ...prev,
          [recoId]: {
            likes: prev[recoId].likes + 1,
            dislikes: dislikeStateMap[recoId] === 'disliked' ? prev[recoId].dislikes - 1 : prev[recoId].dislikes
          }
        }));
        setBumpMap(prev => ({ ...prev, [recoId]: { ...prev[recoId], like: true } }));
        setTimeout(() => setBumpMap(prev => ({ ...prev, [recoId]: { ...prev[recoId], like: false } })), 300);
      }, 800);
    } catch {
      setLikeStateMap(prev => ({ ...prev, [recoId]: 'none' }));
    }
  };

  const handleDislike = async (recoId: number) => {
    if (dislikeStateMap[recoId] === 'disliked') return;
    setDislikeStateMap(prev => ({ ...prev, [recoId]: 'loading' }));
    try {
      await axios.post(`https://localhost:7083/api/RecommendationLike/Dislike/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimeout(() => {
        setDislikeStateMap(prev => ({ ...prev, [recoId]: 'disliked' }));
        setLikeStateMap(prev => ({ ...prev, [recoId]: 'none' }));
        setCounts(prev => ({
          ...prev,
          [recoId]: {
            dislikes: prev[recoId].dislikes + 1,
            likes: likeStateMap[recoId] === 'liked' ? prev[recoId].likes - 1 : prev[recoId].likes
          }
        }));
        setBumpMap(prev => ({ ...prev, [recoId]: { ...prev[recoId], dislike: true } }));
        setTimeout(() => setBumpMap(prev => ({ ...prev, [recoId]: { ...prev[recoId], dislike: false } })), 300);
      }, 800);
    } catch {
      setDislikeStateMap(prev => ({ ...prev, [recoId]: 'none' }));
    }
  };

  const getLikeIcon = (recoId: number) => {
    if (likeStateMap[recoId] === 'loading') return likeLoading;
    if (likeStateMap[recoId] === 'liked') return likeAfter;
    return likeBefore;
  };

  const getDislikeIcon = (recoId: number) => {
    if (dislikeStateMap[recoId] === 'loading') return dislikeLoading;
    if (dislikeStateMap[recoId] === 'disliked') return dislikeAfter;
    return dislikeBefore;
  };

  const handleAddRecommendation = () => {
    const placeDetails = {
      placeId,
      placeName,
      latitude,
      longitude,
      cityName: "",
      countryName: "",
      countryCode: "",
      categoryId // ✅ נשמר
    };
    localStorage.setItem("selectedPlace", JSON.stringify(placeDetails));
    navigate("/addReco");
  };

  return (
    <div className="recommendation-modal-overlay" onClick={onClose}>
      <div
        className="recommendation-modal-content"
        onClick={(e) => e.stopPropagation()} // מונע סגירה כשנלחצים בפנים
      >
        <div className="modal-header">
          <button onClick={onClose} className="close-button">
            <img src="/icons/letter-x.png" alt="סגור" className="close-icon" />
          </button>
        </div>
  
        <h2>המלצות על {placeName}</h2>
  
        {details && (
          <div style={{ marginBottom: 10 }}>
            <p><strong>כתובת:</strong> {details.address}</p>
            {details.rating && (
              <p><strong>דירוג:</strong> ⭐ {details.rating} ({details.user_ratings_total} ביקורות)</p>
            )}
            {details.website && <p><a href={details.website} target="_blank" rel="noopener noreferrer">🌐 אתר</a></p>}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {details.photos.slice(0, 5).map((url, idx) => (
                <img key={idx} src={url} alt="מקום" style={{ width: 120, borderRadius: 10 }} />
              ))}
            </div>
          </div>
        )}
  
        <button onClick={handleAddRecommendation}>➕ הוסף המלצה</button>
  
        <ul style={{ marginTop: 20 }}>
          {recommendations.map((reco) => {
            const user = usersByReco[reco.recoId];
            return (
              <div key={reco.recoId} style={{ marginBottom: 10, padding: 10, borderBottom: "1px solid #eee" }}>
                {user && (
                  <div className="reco-user-info">
                    <img
                      className="reco-user-pic"
                      src={`https://localhost:7083/api/User/getimage/${user.userId}`}
                      alt="user"
                    />
                    <span className="reco-user-name">{user.name}</span>
                  </div>
                )}
                <h4>{reco.title}</h4>
                <p>{reco.description}</p>
                {imagesByReco[reco.recoId]?.length > 0 && (
                  <div className="slider">
                    <img
                      className="slider-image"
                      src={`https://localhost:7083/api/Image/getimage/${imagesByReco[reco.recoId][currentImageIndex[reco.recoId]].imageId}`}
                      alt="המלצה"
                    />
                    <button className="arrow left" onClick={() =>
                      setCurrentImageIndex(prev => ({
                        ...prev,
                        [reco.recoId]: (currentImageIndex[reco.recoId] - 1 + imagesByReco[reco.recoId].length) % imagesByReco[reco.recoId].length
                      }))}>‹</button>
                    <button className="arrow right" onClick={() =>
                      setCurrentImageIndex(prev => ({
                        ...prev,
                        [reco.recoId]: (currentImageIndex[reco.recoId] + 1) % imagesByReco[reco.recoId].length
                      }))}>›</button>
                  </div>
                )}
  
                <div className="like-dislike-row">
                  <div onClick={() => handleLike(reco.recoId)} className="reco-button">
                    <img src={getLikeIcon(reco.recoId)} alt="Like" className="reco-icon" />
                    <span className={`reco-count ${bumpMap[reco.recoId]?.like ? "bump" : ""}`}>{counts[reco.recoId]?.likes}</span>
                  </div>
                  <div onClick={() => handleDislike(reco.recoId)} className="reco-button">
                    <img src={getDislikeIcon(reco.recoId)} alt="Dislike" className="reco-icon" />
                    <span className={`reco-count ${bumpMap[reco.recoId]?.dislike ? "bump" : ""}`}>{counts[reco.recoId]?.dislikes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
  
};

export default RecommendationModal;
