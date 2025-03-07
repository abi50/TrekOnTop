using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Services.Services
{
    public class RecommendationLikeService
    {
        private readonly IRepository<RecommendationLike> _likeRepository;
        private readonly IRepository<Recommendation> _recommendationRepository;
        private readonly IMapper _mapper;

        public RecommendationLikeService(
            IRepository<RecommendationLike> likeRepository,
            IRepository<Recommendation> recommendationRepository,
            IMapper mapper)
        {
            _likeRepository = likeRepository;
            _recommendationRepository = recommendationRepository;
            _mapper = mapper;
        }

        public RecommendationLikeDto ToggleLike(int userId, int recoId)
        {
            var recommendation = _recommendationRepository.Get(recoId);
            if (recommendation == null) return null;

            var existingLike = _likeRepository.GetAll()
                .FirstOrDefault(like => like.UserId == userId && like.RecoId == recoId);

            if (existingLike != null)
            {
                if (existingLike.IsLike)
                {
                    // אם המשתמש כבר לחץ לייק - מחק את הלייק בלבד
                    _likeRepository.DeleteItem(existingLike.Id);
                    recommendation.Likes--;
                    _recommendationRepository.UpdateItem(recoId, recommendation);
                    return null;
                }
                else
                {
                    // אם המשתמש שם דיסלייק והחליט להפוך אותו ללייק
                    existingLike.IsLike = true;
                    _likeRepository.UpdateItem(existingLike.Id, existingLike);
                    recommendation.Likes++;
                    recommendation.Dislikes--;
                }
            }
            else
            {
                // אם המשתמש לא לחץ כלום - הוסף לייק
                _likeRepository.AddItem(new RecommendationLike
                {
                    UserId = userId,
                    RecoId = recoId,
                    IsLike = true
                });
                recommendation.Likes++;
            }

            _recommendationRepository.UpdateItem(recoId, recommendation);
            return _mapper.Map<RecommendationLikeDto>(existingLike ?? new RecommendationLike
            {
                UserId = userId,
                RecoId = recoId,
                IsLike = true
            });
        }

        public RecommendationLikeDto ToggleDislike(int userId, int recoId)
        {
            var recommendation = _recommendationRepository.Get(recoId);
            if (recommendation == null) return null;

            var existingLike = _likeRepository.GetAll()
                .FirstOrDefault(like => like.UserId == userId && like.RecoId == recoId);

            if (existingLike != null)
            {
                if (!existingLike.IsLike)
                {
                    // אם המשתמש כבר לחץ דיסלייק - מחק את הדיסלייק בלבד
                    _likeRepository.DeleteItem(existingLike.Id);
                    recommendation.Dislikes--;
                    _recommendationRepository.UpdateItem(recoId, recommendation);
                    return null;
                }
                else
                {
                    // אם המשתמש שם לייק והחליט להפוך אותו לדיסלייק
                    existingLike.IsLike = false;
                    _likeRepository.UpdateItem(existingLike.Id, existingLike);
                    recommendation.Dislikes++;
                    recommendation.Likes--;
                }
            }
            else
            {
                // אם המשתמש לא לחץ כלום - הוסף דיסלייק
                _likeRepository.AddItem(new RecommendationLike
                {
                    UserId = userId,
                    RecoId = recoId,
                    IsLike = false
                });
                recommendation.Dislikes++;
            }

            _recommendationRepository.UpdateItem(recoId, recommendation);
            return _mapper.Map<RecommendationLikeDto>(existingLike ?? new RecommendationLike
            {
                UserId = userId,
                RecoId = recoId,
                IsLike = false
            });
        }
    }
}
