using AutoMapper;
using Common.Dtos;
using Microsoft.AspNetCore.Http;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System.Security.Claims;

public class RecommendationService : IRecommendationService
{
    private readonly IRepository<Recommendation> _repository;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public RecommendationService(IRepository<Recommendation> repository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
    {
        _repository = repository;
        _mapper = mapper;
        _httpContextAccessor = httpContextAccessor;
    }

    public int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : throw new Exception("User not authenticated.");
    }

    public RecommendationDto AddItem(RecommendationDto item)
    {
        var recommendation = _mapper.Map<Recommendation>(item);
        _repository.AddItem(recommendation);
        return _mapper.Map<RecommendationDto>(recommendation);
    }

    public void Delete(int id)
    {
        if (!IsOwnedByCurrentUser(id))
            throw new Exception("Unauthorized.");
        _repository.DeleteItem(id);
    }

    public List<RecommendationDto> GetAll()
    {
        return _mapper.Map<List<RecommendationDto>>(_repository.GetAll());
    }

    public RecommendationDto GetById(int id)
    {
        var reco = _repository.Get(id);
        return reco != null ? _mapper.Map<RecommendationDto>(reco) : null;
    }

    public RecommendationDto Update(int id, RecommendationDto item)
    {
        if (!IsOwnedByCurrentUser(id))
            throw new Exception("Unauthorized.");

        var updated = _repository.UpdateItem(id, _mapper.Map<Recommendation>(item));
        return _mapper.Map<RecommendationDto>(updated);
    }

    public List<RecommendationDto> GetPaged(int page, int limit)
    {
        return GetAll()
            .OrderByDescending(r => r.RecoId)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();
    }

    public List<RecommendationDto> GetByPlaceId(int placeId)
    {
        return GetAll().Where(r => r.PlaceId == placeId).ToList();
    }

    public bool IsOwnedByCurrentUser(int recoId)
    {
        var recommendation = _repository.Get(recoId);
        return recommendation != null && recommendation.UserId == GetCurrentUserId();
    }
}
