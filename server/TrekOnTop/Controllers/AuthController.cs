using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using Services.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace TrekOnTop.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromForm] LoginDto loginData)
        {
            var token = _authService.Login(loginData);
            return token == null
                ? Unauthorized("Invalid email or password")
                : Ok(token);
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] UserDto newUser)
        {
            if (string.IsNullOrEmpty(newUser.Email) || string.IsNullOrEmpty(newUser.Password))
                return BadRequest("Email and Password are required.");

            if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(newUser.Email))
                return BadRequest("Invalid email format.");

            try
            {
                var token = _authService.Register(newUser);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpGet("check")]
        public IActionResult CheckUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = _authService.GetUserById(userId);
            return user == null
                ? NotFound("User not found.")
                : Ok(new { user.UserId, user.Name, user.Email });
        }

        [Authorize]
        [HttpPost("verify-password")]
        public IActionResult VerifyPassword([FromBody] string password)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = _authService.VerifyPassword(userId, password);
            return result ? Ok("Password is correct") : Unauthorized("Incorrect password");
        }

        [Authorize]
        [HttpPut("change-password")]
        public IActionResult ChangePassword([FromBody] string newPassword)
        {
            if (string.IsNullOrEmpty(newPassword))
                return BadRequest("New password is required.");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            _authService.ChangePassword(userId, newPassword);

            return Ok("Password updated successfully.");
        }
    }
}
