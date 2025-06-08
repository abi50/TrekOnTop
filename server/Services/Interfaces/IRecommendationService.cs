using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IRecommendationService : IService<RecommendationDto>
    {
        List<RecommendationDto> GetPaged(int page, int limit);
        List<RecommendationDto> GetByPlaceId(int placeId);
        bool IsOwnedByCurrentUser(int recoId);
        int GetCurrentUserId();
    }

}
