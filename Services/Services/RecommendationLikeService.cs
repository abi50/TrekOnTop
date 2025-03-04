using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Services.Services
{
    public class RecommendationLikeService : IService<RecommendationDto>
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

        public List<RecommendationDto> GetAll()
        {
            return _recommendationRepository.GetAll()
                .Select(reco => _mapper.Map<RecommendationDto>(reco))
                .ToList();
        }

        public RecommendationDto GetById(int id)
        {
            return _mapper.Map<RecommendationDto>(_recommendationRepository.Get(id));
        }

        public RecommendationDto AddItem(RecommendationDto item)
        {
            return _mapper.Map<RecommendationDto>(
                _recommendationRepository.AddItem(_mapper.Map<Recommendation>(item))
            );
        }

        public void Delete(int id)
        {
            _recommendationRepository.DeleteItem(id);
        }

        public RecommendationDto Update(int id, RecommendationDto item)
        {
            return _mapper.Map<RecommendationDto>(
                _recommendationRepository.UpdateItem(id, _mapper.Map<Recommendation>(item))
            );
        }

        // ✅ פונקציה לטיפול בלייקים
        public async Task<RecommendationDto> ToggleLikeAsync(int userId, int recoId)
        {
            var recommendation = _recommendationRepository.Get(recoId);
            if (recommendation == null)
                return null;

            var existingLike = _likeRepository.GetAll()
                .FirstOrDefault(like => like.UserId == userId && like.RecoId == recoId);

            if (existingLike != null)
            {
                if (existingLike.IsLike)
                {
                    _likeRepository.DeleteItem(existingLike.Id);
                    recommendation.Likes--;
                }
                else
                {
                    existingLike.IsLike = true;
                    recommendation.Likes++;
                    recommendation.Dislikes--;
                    _likeRepository.UpdateItem(existingLike.Id, existingLike);
                }
            }
            else
            {
                _likeRepository.AddItem(new RecommendationLike
                {
                    UserId = userId,
                    RecoId = recoId,
                    IsLike = true
                });
                recommendation.Likes++;
            }

            _recommendationRepository.UpdateItem(recoId, recommendation);
            return _mapper.Map<RecommendationDto>(recommendation);
        }

        // ✅ פונקציה לטיפול בדיסלייקים
        public async Task<RecommendationDto> ToggleDislikeAsync(int userId, int recoId)
        {
            var recommendation = _recommendationRepository.Get(recoId);
            if (recommendation == null)
                return null;

            var existingLike = _likeRepository.GetAll()
                .FirstOrDefault(like => like.UserId == userId && like.RecoId == recoId);

            if (existingLike != null)
            {
                if (!existingLike.IsLike)
                {
                    _likeRepository.DeleteItem(existingLike.Id);
                    recommendation.Dislikes--;
                }
                else
                {
                    existingLike.IsLike = false;
                    recommendation.Dislikes++;
                    recommendation.Likes--;
                    _likeRepository.UpdateItem(existingLike.Id, existingLike);
                }
            }
            else
            {
                _likeRepository.AddItem(new RecommendationLike
                {
                    UserId = userId,
                    RecoId = recoId,
                    IsLike = false
                });
                recommendation.Dislikes++;
            }

            _recommendationRepository.UpdateItem(recoId, recommendation);
            return _mapper.Map<RecommendationDto>(recommendation);
        }
    }
}
