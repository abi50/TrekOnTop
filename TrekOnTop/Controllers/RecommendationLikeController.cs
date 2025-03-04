using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Entity;
using Services.Interfaces;
using Services.Services;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class RecommendationController : ControllerBase
{
    private readonly IService<RecommendationDto> _recommendationService;
    private readonly IService<ImageDto> _imageService;
    private readonly IService<UserDto> _userService;
    private readonly RecommendationLikeService _recommendationLikeService;

    public RecommendationController(
        IService<RecommendationDto> recommendationService,
        IService<ImageDto> imageService,
        IService<UserDto> userService,
        RecommendationLikeService recommendationLikeService)
    {
        _recommendationService = recommendationService;
        _imageService = imageService;
        _userService = userService;
        _recommendationLikeService = recommendationLikeService;
    }

    [Authorize]
    [HttpPost("Like/{id}")]
    public async Task<IActionResult> AddLike(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _recommendationLikeService.ToggleLikeAsync(userId, id);

        if (result == null)
            return NotFound("Recommendation not found.");

        return Ok(result);
    }

    [Authorize]
    [HttpPost("Dislike/{id}")]
    public async Task<IActionResult> AddDislike(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        var result = await _recommendationLikeService.ToggleDislikeAsync(userId, id);

        if (result == null)
            return NotFound("Recommendation not found.");

        return Ok(result);
    }
}
