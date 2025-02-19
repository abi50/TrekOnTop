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
    public class RecommandationController : ControllerBase
    {
       
            private readonly IService<RecommendationDto> _recommendationService;
            public RecommandationController(IService<RecommendationDto> recommandationService)
            {
                _recommendationService = recommandationService;
            }

            // GET: api/<UserController>
            [HttpGet]
            public List<RecommendationDto> Get()
            {
                return _recommendationService.GetAll();
            }

            // GET api/<UserController>/5
            [HttpGet("{id}")]
            public IActionResult Get(int id)
            {
                var recommendation = _recommendationService.GetById(id);
                if (recommendation == null)
                {
                    return NotFound($"Recommendation with ID {id} not found.");
                }
                return Ok(recommendation);
            }


        // POST api/<UserController>
        [Authorize]
        [HttpPost]
            public void Post([FromForm] RecommendationDto value)
            {
                _recommendationService.AddItem(value);
            }

        // PUT api/<UserController>/5
        [Authorize]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] RecommendationDto value)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var recommendation = _recommendationService.GetById(id);

            if (recommendation == null)
            {
                return NotFound("Recommendation not found.");
            }

            if (recommendation.UserId != currentUserId)
            {
                return Forbid(); // רק בעל ההמלצה יכול לערוך אותה
            }

            _recommendationService.Update(id, value);
            return Ok("Recommendation updated successfully.");
        }


        // DELETE api/<UserController>/5
        [Authorize]
        [HttpDelete("{id}")]
            public IActionResult Delete(int id)
            {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var recommendation = _recommendationService.GetById(id);
            if (recommendation == null)
            {
                return NotFound("Recommendation not found.");
            }

            if (recommendation.UserId != currentUserId)
            {
                return Forbid(); // רק בעל ההמלצה יכול לערוך אותה
            }
            _recommendationService.Delete(id);
            return Ok("Recommendation deketed successfully.");
        }
    }
}
