using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Services;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController: ControllerBase
    {
        private readonly IService<ImageDto> _imageService;
        private readonly IService<RecommendationDto> _recommendationService;
        public ImageController(IService<ImageDto> imageService, IService<RecommendationDto> recommendationService)
        {
            _imageService = imageService;
            _recommendationService = recommendationService;
        }

        // GET: api/<UserController>
        [HttpGet]
        public List<ImageDto> Get()
        {
            return _imageService.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public ImageDto Get(int id)
        {
            return _imageService.GetById(id);
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post([FromForm] ImageDto value)
        {
            _imageService.AddItem(value);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] ImageDto value)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var image = _imageService.GetById(id);

            if (image == null)
            {
                return NotFound("Image not found.");
            }

            // שלב 1: מציאת ההמלצה שהתמונה שייכת אליה
            var recommendation = _recommendationService.GetById(image.RecommendationId);

            if (recommendation == null)
            {
                return NotFound("Recommendation not found.");
            }

            // שלב 2: בדיקת בעלות – רק מי שיצר את ההמלצה יכול למחוק את התמונה
            if (recommendation.UserId != currentUserId)
            {
                return Forbid(); // מונע ממשתמשים למחוק תמונות של אחרים
            }
            _imageService.Update(id, value);
            return Ok("Image updated successfully.");
        }

        // DELETE api/<UserController>/5
        [Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {

            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var image = _imageService.GetById(id);
            if (image == null)
            {
                Console.WriteLine($"Image with ID {id} not found.");
                return NotFound("Image not found.");
            }

            Console.WriteLine($"Image found: {image.ImageId}, RecommendationId: {image.RecommendationId}");

            //if (image == null)
            //{
            //    return NotFound("Image not found.");
            //}

            // שלב 1: מציאת ההמלצה שהתמונה שייכת אליה
            var recommendation = _recommendationService.GetById(image.RecommendationId);

            if (recommendation == null)
            {
                Console.WriteLine($"Recommendation with ID {id} not found.");
                return BadRequest("Image is not associated with a recommendation.");
            }
            


            // שלב 2: בדיקת בעלות – רק מי שיצר את ההמלצה יכול למחוק את התמונה
            if (recommendation.UserId != currentUserId)
            {
                return Forbid(); // מונע ממשתמשים למחוק תמונות של אחרים
            }

            _imageService.Delete(id);
            return Ok("Image deleted successfully.");
        }

        [HttpGet("getimage/{id}")]
        public IActionResult GetImage(int id)
        {
            var image = _imageService.GetById(id);
            if (image == null)
            {
                return NotFound($"Image with ID {id} not found.");
            }
            if (string.IsNullOrEmpty(image.Url))
            {
                return NotFound("Image not found.");
            }

            var filePath = Path.Combine(Environment.CurrentDirectory, image.Url.TrimStart('/'));
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("Image file not found on server.");
            }

            return PhysicalFile(filePath, "image/jpeg");
        }

    }
}
