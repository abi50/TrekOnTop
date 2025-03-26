using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IRecommendationLikeService
    {
        RecommendationLikeDto ToggleLike(int userId, int recoId);
        RecommendationLikeDto ToggleDislike(int userId, int recoId);
        string GetStatus(int userId, int recoId);

    }

}
