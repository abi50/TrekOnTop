using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;

public class RecommendationLikeService : IRecommendationLikeService
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
            .FirstOrDefault(l => l.UserId == userId && l.RecoId == recoId);

        if (existingLike != null)
        {
            if (existingLike.IsLike)
            {
                _likeRepository.DeleteItem(existingLike.Id);
                recommendation.Likes--;
                _recommendationRepository.UpdateItem(recoId, recommendation);
                return null;
            }
            else
            {
                existingLike.IsLike = true;
                _likeRepository.UpdateItem(existingLike.Id, existingLike);
                recommendation.Likes++;
                recommendation.Dislikes--;
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
            .FirstOrDefault(l => l.UserId == userId && l.RecoId == recoId);

        if (existingLike != null)
        {
            if (!existingLike.IsLike)
            {
                _likeRepository.DeleteItem(existingLike.Id);
                recommendation.Dislikes--;
                _recommendationRepository.UpdateItem(recoId, recommendation);
                return null;
            }
            else
            {
                existingLike.IsLike = false;
                _likeRepository.UpdateItem(existingLike.Id, existingLike);
                recommendation.Dislikes++;
                recommendation.Likes--;
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
        return _mapper.Map<RecommendationLikeDto>(existingLike ?? new RecommendationLike
        {
            UserId = userId,
            RecoId = recoId,
            IsLike = false
        });
    }
    public string GetStatus(int userId, int recoId)
    {
        var like = _likeRepository.GetAll().FirstOrDefault(l => l.UserId == userId && l.RecoId == recoId);
        if (like == null) return "none";
        return like.IsLike ? "liked" : "disliked";
    }

}
