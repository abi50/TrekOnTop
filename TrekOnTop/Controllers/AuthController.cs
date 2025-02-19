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
        private readonly IService<UserDto> service; 
        private readonly IConfiguration config;
        public AuthController(IService<UserDto> service, IConfiguration config)
        {
            this.service = service;
            this.config = config;
        }
        // GET: api/<LoginController>
        [HttpGet]
        public List<UserDto> Get()
        {
            return service.GetAll();
        }

        // GET api/<LoginController>/5
        [HttpGet("{id}")]
        public UserDto Get(int id)
        {
            return service.GetById(id);
        }

        // POST api/<LoginController>
        [HttpPost]
        public IActionResult Post([FromQuery] string mail, [FromQuery] string pass)
        {
            var user = Authenticate(mail, pass);
            if (user != null)
            {
                var token = Generate(user);
                return Ok(token);
            }
            return BadRequest("user does not exist");
        }
        private string Generate(UserDto user)
        {
            //הקוד להצפנה במערך של ביטים 
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
            //אלגוריתם להצפנה
            var carditional = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name,user.Name),
                new Claim(ClaimTypes.NameIdentifier,user.UserId.ToString()),
                new Claim(ClaimTypes.Email,user.Email)
            };

            var token = new JwtSecurityToken(
                config["Jwt:Issuer"], config["Jwt:Audience"]
                , claims,
          expires: DateTime.Now.AddMinutes(45),
              signingCredentials: carditional);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private UserDto Authenticate(string mail, string pass)
        {
            var user = service.GetAll().FirstOrDefault(x => x.Email == mail && x.Password == pass);
            return user;
        }
        // PUT api/<LoginController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] UserDto value)
        {
            service.Update(id, value);
        }

        // DELETE api/<LoginController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            service.Delete(id);
        }

        [HttpPost("register")]
        public IActionResult Register([FromQuery] UserDto newUser)
        {
            if (string.IsNullOrEmpty(newUser.Email) || string.IsNullOrEmpty(newUser.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            if (!IsValidEmail(newUser.Email))
            {
                return BadRequest("Invalid email format.");
            }



            var existingUser = service.GetAll().FirstOrDefault(x => x.Email == newUser.Email);
            if (existingUser != null)
            {
                return BadRequest("User with this email already exists.");
            }

            // הצפנת הסיסמה לפני שמירתה
            newUser.Password = HashPassword(newUser.Password);

            service.AddItem(newUser);
            return Ok("User registered successfully.");
        }

        private bool IsValidEmail(string email)
        {
            return new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email);
        }
        // פונקציה להצפנת הסיסמה
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

    }
}
