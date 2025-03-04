﻿using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
