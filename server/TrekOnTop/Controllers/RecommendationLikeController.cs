using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Services;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationLikeController : ControllerBase
    {
        private readonly RecommendationLikeService _recommendationLikeService;

        public RecommendationLikeController(RecommendationLikeService recommendationLikeService)
        {
            _recommendationLikeService = recommendationLikeService;
        }

        // ✅ הוספת לייק להמלצה (כברירת מחדל הופך דיסלייק אם היה)
        [Authorize]
        [HttpPost("Like/{id}")]
        public IActionResult AddLike(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized("User not logged in.");

            var result = _recommendationLikeService.ToggleLike(userId.Value, id);
            return result == null ? NotFound("Recommendation not found.") : Ok(result);
        }

        // ✅ הוספת דיסלייק להמלצה (כברירת מחדל הופך לייק אם היה)
        [Authorize]
        [HttpPost("Dislike/{id}")]
        public IActionResult AddDislike(int id)
        {
            var userId = GetCurrentUserId();
            if (userId == null) return Unauthorized("User not logged in.");

            var result = _recommendationLikeService.ToggleDislike(userId.Value, id);
            return result == null ? NotFound("Recommendation not found.") : Ok(result);
        }

        // ✅ פונקציה פרטית לשליפת ה-UserId מה-Token
        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userIdClaim != null ? int.Parse(userIdClaim) : (int?)null;
        }
    }
}
