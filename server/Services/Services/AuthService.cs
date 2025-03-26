using Common.Dtos;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

public class AuthService : IAuthService
{
    private readonly IService<UserDto> _userService;
    private readonly IConfiguration _config;

    public AuthService(IService<UserDto> userService, IConfiguration config)
    {
        _userService = userService;
        _config = config;
    }

    public string Login(LoginDto loginData)
    {
        var user = _userService.GetAll().FirstOrDefault(x => x.Email == loginData.Email);
        if (user == null || !VerifyPasswordHash(loginData.Password, user.Password))
            return null;

        return GenerateToken(user);
    }

    public string Register(UserDto newUser)
    {
        if (_userService.GetAll().Any(x => x.Email == newUser.Email))
            throw new Exception("User with this email already exists.");

        newUser.Password = HashPassword(newUser.Password);
        var addedUser = _userService.AddItem(newUser);
        return GenerateToken(addedUser);
    }

    public bool VerifyPassword(int userId, string password)
    {
        var user = _userService.GetById(userId);
        return user != null && VerifyPasswordHash(password, user.Password);
    }

    public void ChangePassword(int userId, string newPassword)
    {
        var user = _userService.GetById(userId);
        if (user == null) throw new Exception("User not found.");

        user.Password = HashPassword(newPassword);
        _userService.Update(userId, user);
    }

    public UserDto GetUserById(int userId) => _userService.GetById(userId);

    private string GenerateToken(UserDto user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
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
            expires: DateTime.Now.AddMinutes(10080),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }

    private bool VerifyPasswordHash(string enteredPassword, string storedHashedPassword)
    {
        return HashPassword(enteredPassword) == storedHashedPassword;
    }
}
