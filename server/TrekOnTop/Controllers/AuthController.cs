using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace TrekOnTop.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IService<UserDto> _service;
        private readonly IConfiguration _config;

        public AuthController(IService<UserDto> service, IConfiguration config)
        {
            _service = service;
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromQuery] string email, [FromQuery] string password)
        {
            var user = _service.GetAll().FirstOrDefault(x => x.Email == email);
            if (user == null || !VerifyPassword(password, user.Password))
            {
                return BadRequest("Invalid email or password");
            }

            var token = GenerateToken(user);
            return Ok(token);
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] RegisterDto newUser)
        {
            if (string.IsNullOrEmpty(newUser.Email) || string.IsNullOrEmpty(newUser.Password))
                return BadRequest("Email and Password are required.");

            if (!IsValidEmail(newUser.Email))
                return BadRequest("Invalid email format.");

            if (_service.GetAll().Any(x => x.Email == newUser.Email))
                return BadRequest("User with this email already exists.");

            byte[]? profilePic = null;
            if (newUser.File != null && newUser.File.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    newUser.File.CopyTo(memoryStream);
                    profilePic = memoryStream.ToArray();
                }
            }

            var userDto = new UserDto
            {
                Name = newUser.Name,
                Email = newUser.Email,
                Password = HashPassword(newUser.Password),
                ProfilPic = profilePic
            };

            var addedUser = _service.AddItem(userDto);
            var token = GenerateToken(addedUser);

            return Ok( token );
        }



        private string GenerateToken(UserDto user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(45),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool IsValidEmail(string email)
        {
            return new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string enteredPassword, string storedHashedPassword)
        {
            return HashPassword(enteredPassword) == storedHashedPassword;
        }
    }
}
