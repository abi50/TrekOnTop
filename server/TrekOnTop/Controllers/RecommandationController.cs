using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class RecommendationController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly IService<ImageDto> _imageService;
    private readonly IService<UserDto> _userService;

    public RecommendationController(
        IRecommendationService recommendationService,
        IService<ImageDto> imageService,
        IService<UserDto> userService)
    {
        _recommendationService = recommendationService;
        _imageService = imageService;
        _userService = userService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_recommendationService.GetAll());

    [HttpGet("paged")]
    public IActionResult GetPagedRecommendations([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        return Ok(_recommendationService.GetPaged(page, limit));
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var reco = _recommendationService.GetById(id);
        return reco == null ? NotFound() : Ok(reco);
    }

    [HttpGet("{id}/images")]
    public IActionResult GetImages(int id)
    {
        var images = _imageService.GetAll().Where(img => img.RecommendationId == id).ToList();
        return Ok(images);
    }

    [HttpGet("{id}/user")]
    public IActionResult GetUser(int id)
    {
        var reco = _recommendationService.GetById(id);
        if (reco == null) return NotFound("Recommendation not found.");
        var user = _userService.GetById(reco.UserId);
        return user == null ? NotFound("User not found.") : Ok(user);
    }

    [Authorize]
    [HttpPost]
    public IActionResult Post([FromForm] RecommendationDto value)
    {
        if (value == null) return BadRequest("Invalid recommendation data.");
        var newReco = _recommendationService.AddItem(value);
        return CreatedAtAction(nameof(Post), new { id = newReco.RecoId }, newReco);
    }

    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] RecommendationDto value)
    {
        try
        {
            _recommendationService.Update(id, value);
            return NoContent();
        }
        catch (Exception ex)
        {
            return Forbid(ex.Message);
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _recommendationService.Delete(id);
            return NoContent();
        }
        catch (Exception ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpGet("byPlace/{placeId}")]
    public IActionResult GetRecommendationsByPlace(int placeId)
    {
        var recommendations = _recommendationService.GetByPlaceId(placeId);
        return recommendations.Any() ? Ok(recommendations) : NotFound("No recommendations found.");
    }
}
