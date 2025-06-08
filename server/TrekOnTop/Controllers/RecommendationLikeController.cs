using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Services.Interfaces;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class RecommendationLikeController : ControllerBase
{
    private readonly IRecommendationLikeService _likeService;

    public RecommendationLikeController(IRecommendationLikeService likeService)
    {
        _likeService = likeService;
    }

    [Authorize]
    [HttpPost("Like/{id}")]
    public IActionResult AddLike(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized("User not logged in.");

        var result = _likeService.ToggleLike(userId.Value, id);
        return result == null ? NotFound("Recommendation not found.") : Ok(result);
    }

    [Authorize]
    [HttpPost("Dislike/{id}")]
    public IActionResult AddDislike(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized("User not logged in.");

        var result = _likeService.ToggleDislike(userId.Value, id);
        return result == null ? NotFound("Recommendation not found.") : Ok(result);
    }
    [Authorize]
    [HttpGet("status/{recoId}")]
    public IActionResult GetLikeStatus(int recoId)
    {
        var userId = GetCurrentUserId();
        var status = _likeService.GetStatus(userId.Value, recoId); // מחזיר: liked / disliked / none
        return Ok(status);
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return userIdClaim != null ? int.Parse(userIdClaim) : (int?)null;
    }
}
