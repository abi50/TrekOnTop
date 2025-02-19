using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
     // דורש JWT
    [Route("api/[controller]")]
    [ApiController]
    public class UserController: ControllerBase
    {
        
            private readonly IService<UserDto> _userService;
            public UserController(IService<UserDto> userService)
            {
                _userService = userService;
            }

            // GET: api/<UserController>
            [HttpGet]
            public List<UserDto> Get()
            {
                return _userService.GetAll();
            }

        // GET api/<UserController>/5
        [Authorize]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (id != currentUserId)
            {
                return Forbid(); // מונע ממשתמשים לצפות בפרופיל של מישהו אחר
            }

            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }
            return Ok(user);
        }


        // POST api/<UserController>
        [HttpPost]
            public void Post([FromForm] UserDto value)
            {
                _userService.AddItem(value);
            }

            // PUT api/<UserController>/5
            [HttpPut("{id}")]
            public void Put(int id, [FromForm] UserDto value)
            {
            _userService.Update(id, value);
            }

        // DELETE api/<UserController>/5
        [Authorize]
        [HttpDelete("{id}")]
            public IActionResult Delete(int id)
            {
                 var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                 if (id != currentUserId)
                 {
                     return Forbid(); // מונע ממשתמשים לצפות בפרופיל של מישהו אחר
                 }

                 var user = _userService.GetById(id);
                 if (user == null)
                 {
                     return NotFound($"User with ID {id} not found.");
                 }
                 _userService.Delete(id);
                  return Ok(user);
            }
        [Authorize]
        [HttpGet("getimage/{id}")]
            public IActionResult GetImage(int id)
            {
                var user = _userService.GetById(id);
                if (user == null)
                {
                    return NotFound($"User with ID {id} not found.");
                }
                if (user.ProfilPic == null || user.ProfilPic.Length == 0)
                {
                    return NotFound("Profile picture not found.");
                }
                return File(user.ProfilPic, "image/jpg");
            }

    }
}
