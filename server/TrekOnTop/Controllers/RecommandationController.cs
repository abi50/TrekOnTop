using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Collections.Generic;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationController : ControllerBase
    {
        private readonly IService<RecommendationDto> _recommendationService;
        private readonly IService<ImageDto> _imageService;
        private readonly IService<UserDto> _userService;

        public RecommendationController(
            IService<RecommendationDto> recommendationService,
            IService<ImageDto> imageService,
            IService<UserDto> userService)
        {
            _recommendationService = recommendationService;
            _imageService = imageService;
            _userService = userService;
        }

        // ✅ שליפת כל ההמלצות
        [HttpGet]
        public ActionResult<List<RecommendationDto>> Get()
        {
            return Ok(_recommendationService.GetAll());
        }
        //שליפת כל ההמלצות מחולק לדפים בשביל טעיהנאינסופית
        [HttpGet("paged")]
        public IActionResult GetPagedRecommendations([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            var all = _recommendationService.GetAll()
                .OrderByDescending(r => r.RecoId) 
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return Ok(all);
        }


        // ✅ שליפת המלצה לפי ID
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var recommendation = _recommendationService.GetById(id);
            if (recommendation == null)
                return NotFound($"Recommendation with ID {id} not found.");
            return Ok(recommendation);
        }

        // ✅ שליפת כל התמונות של המלצה מסוימת
        [HttpGet("{id}/images")]
        public IActionResult GetImages(int id)
        {
            var images = _imageService.GetAll().Where(img => img.RecommendationId == id).ToList();
            return Ok(images);
        }

        // ✅ שליפת המשתמש שכתב את ההמלצה
        [HttpGet("{id}/user")]
        public IActionResult GetUser(int id)
        {
            var recommendation = _recommendationService.GetById(id);
            if (recommendation == null)
                return NotFound("Recommendation not found.");

            var user = _userService.GetById(recommendation.UserId);
            if (user == null)
                return NotFound("User not found.");

            return Ok(user);
        }

        // ✅ יצירת המלצה חדשה
        [Authorize]
        [HttpPost]
        public IActionResult Post([FromForm] RecommendationDto value)
        {
            if (value == null)
                return BadRequest("Invalid recommendation data.");

            var newRecommendation = _recommendationService.AddItem(value);
            return CreatedAtAction(nameof(Post), new { id = newRecommendation.RecoId }, newRecommendation);
        }

        // ✅ עדכון המלצה (רק בעל ההמלצה יכול לערוך)
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] RecommendationDto value)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var recommendation = _recommendationService.GetById(id);

            if (recommendation == null)
                return NotFound("Recommendation not found.");

            if (recommendation.UserId != currentUserId)
                return Forbid();

            _recommendationService.Update(id, value);
            return NoContent();
        }

        // ✅ מחיקת המלצה (רק בעל ההמלצה יכול למחוק)
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var recommendation = _recommendationService.GetById(id);

            if (recommendation == null)
                return NotFound("Recommendation not found.");

            if (recommendation.UserId != currentUserId)
                return Forbid();

            _recommendationService.Delete(id);
            return NoContent();
        }

        // RecommendationController.cs
        [HttpGet("byPlace/{placeId}")]
        public IActionResult GetRecommendationsByPlace(int placeId)
        {
            var recommendations = _recommendationService.GetAll()
                .Where(r => r.PlaceId == placeId).ToList();

            if (!recommendations.Any())
                return NotFound("No recommendations found for this place.");

            return Ok(recommendations);
        }

    }
}
