import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RecommendationCard.css';

// אייקונים
import likeBefore from '../assets/like_before.png';
import likeLoading from '../assets/like_loading.gif';
import likeAfter from '../assets/like_after.png';

import dislikeBefore from '../assets/dislike_before.png';
import dislikeLoading from '../assets/dislike_loading.gif';
import dislikeAfter from '../assets/dislike_after.png';

interface Props {
  recoId: number;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
  token: string;
}

const RecommendationCard: React.FC<Props> = ({
  recoId,
  title,
  description,
  likes,
  dislikes,
  token
}) => {
  const [likeState, setLikeState] = useState<'none' | 'loading' | 'liked'>('none');
  const [dislikeState, setDislikeState] = useState<'none' | 'loading' | 'disliked'>('none');

  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [likeBump, setLikeBump] = useState(false);
  const [dislikeBump, setDislikeBump] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`https://localhost:7083/api/RecommendationLike/status/${recoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const status = res.data.status;
        if (status === 'liked') setLikeState('liked');
        if (status === 'disliked') setDislikeState('disliked');
      } catch (err) {
        console.error('Failed to fetch like status', err);
      }
    };
    fetchStatus();
  }, [recoId, token]);
  const handleLike = async () => {
    if (likeState === 'liked') return;

    setLikeState('loading');
    try {
      await axios.post(`https://localhost:7083/api/RecommendationLike/Like/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTimeout(() => {
        setLikeState('liked');
        setDislikeState('none');
        setLikeCount((prev) => prev + 1);
        if (dislikeState === 'disliked') setDislikeCount((prev) => prev - 1);

        setLikeBump(true);
        setTimeout(() => setLikeBump(false), 300);
      }, 800);
    } catch (err) {
      console.error('Like failed', err);
      setLikeState('none');
    }
  };

  const handleDislike = async () => {
    if (dislikeState === 'disliked') return;

    setDislikeState('loading');
    try {
      await axios.post(`https://localhost:7083/api/RecommendationLike/Dislike/${recoId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTimeout(() => {
        setDislikeState('disliked');
        setLikeState('none');
        setDislikeCount((prev) => prev + 1);
        if (likeState === 'liked') setLikeCount((prev) => prev - 1);

        setDislikeBump(true);
        setTimeout(() => setDislikeBump(false), 300);
      }, 800);
    } catch (err) {
      console.error('Dislike failed', err);
      setDislikeState('none');
    }
  };

  const getLikeIcon = () => {
    if (likeState === 'loading') return likeLoading;
    if (likeState === 'liked') return likeAfter;
    return likeBefore;
  };

  const getDislikeIcon = () => {
    if (dislikeState === 'loading') return dislikeLoading;
    if (dislikeState === 'disliked') return dislikeAfter;
    return dislikeBefore;
  };

  return (
    <div className="reco-card">
      <h4>{title}</h4>
      <p>{description}</p>
      <div className="like-dislike-row">
        <div onClick={handleLike} className="reco-button">
          <img src={getLikeIcon()} alt="Like" className="reco-icon" />
          <span className={`reco-count ${likeBump ? 'bump' : ''}`}>{likeCount}</span>
        </div>
        <div onClick={handleDislike} className="reco-button">
          <img src={getDislikeIcon()} alt="Dislike" className="reco-icon" />
          <span className={`reco-count ${dislikeBump ? 'bump' : ''}`}>{dislikeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
