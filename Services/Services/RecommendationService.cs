using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Services.Services
{
    public class RecommendationService : IService<RecommendationDto>
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
        private int GetCurrentUserId()
        {
            var httpContextAccessor = new HttpContextAccessor();
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
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
            _repository.DeleteItem(id);
        }

        public List<RecommendationDto> GetAll()
        {
            var recommendations = _repository.GetAll();
            return _mapper.Map<List<RecommendationDto>>(recommendations);
        }

        public RecommendationDto GetById(int id)
        {
            var recommendation = _repository.Get(id);
            return _mapper.Map<RecommendationDto>(recommendation);
        }
       

        public RecommendationDto Update(int id, RecommendationDto item)
        {
            
                var currentUserId = GetCurrentUserId();
                var recommendation = _repository.Get(id);
                if (recommendation == null)
                    throw new Exception("Recommendation not found.");

                if (recommendation.UserId != currentUserId)
                    throw new Exception("Unauthorized. You can only update your own recommendations.");

                var updatedRecommendation = _repository.UpdateItem(id, _mapper.Map<Recommendation>(item));
                return _mapper.Map<RecommendationDto>(updatedRecommendation);
            
        }
    }

}
