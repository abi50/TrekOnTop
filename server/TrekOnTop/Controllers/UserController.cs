using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IService<UserDto> _userService;

        public UserController(IService<UserDto> userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_userService.GetAll());
        }

        [Authorize]
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            if (id != currentUserId) return Forbid();

            var user = _userService.GetById(id);
            return user != null ? Ok(user) : NotFound($"User with ID {id} not found.");
        }

        [HttpPost]
        public IActionResult Post([FromForm] UserDto value)
        {
            _userService.AddItem(value);
            return Ok("User added successfully");
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromForm] UserDto value)
        {
            var existingUser = _userService.GetById(id);
            if (existingUser == null)
                return NotFound("User not found.");

            // רק אם המשתמש שלח סיסמה חדשה
            if (!string.IsNullOrEmpty(value.Password))
            {
                value.Password = HashPassword(value.Password);
            }
            else
            {
                value.Password = existingUser.Password;
            }

            // אם לא שלח תמונה חדשה – משאיר את הקיימת
            if (value.File == null)
            {
                value.ProfilPic = existingUser.ProfilPic;
            }

            _userService.Update(id, value);
            return Ok("User updated successfully");
        }
       

        // ניתן להעתיק את זה מ־AuthController או לשתף פונקציה סטטית
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }


        //[Authorize]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized("User ID is missing from the token.");
            }

            if (!int.TryParse(userIdClaim, out int currentUserId))
            {
                return BadRequest("Invalid User ID format.");
            }

            if (id != currentUserId)
            {
                return Forbid(); // מונע ממשתמשים למחוק משתמש אחר
            }

            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound($"User with ID {id} not found.");
            }

            _userService.Delete(id);
            return Ok("User deleted successfully.");
        }


        
        [HttpGet("getimage/{id}")]
        public IActionResult GetImage(int id)
        {
            var user = _userService.GetById(id);
            if (user?.ProfilPic == null || user.ProfilPic.Length == 0)
                return NotFound("Profile picture not found.");

            return File(user.ProfilPic, "image/jpg");
        }
        //[HttpPut("editimage/{id}")]

        //public IActionResult EditImage(int id)
        //{
        //    var user = _userService.GetById(id);
        //    if (user?.ProfilPic == null || user.ProfilPic.Length == 0)
        //        return NotFound("Profile picture not found.");
        //    user.ProfilPic= 
        //    return Ok("user updated successfully");
        //}
    }
}
