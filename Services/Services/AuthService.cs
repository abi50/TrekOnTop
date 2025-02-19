using Common.Dtos;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    //public class AuthService : IAuthInterface
    //{
    //    private readonly IUserRepository _userRepository;
    //    private readonly IConfiguration _config;

    //    public AuthService(IUserRepository userRepository, IConfiguration config)
    //    {
    //        _userRepository = userRepository;
    //        _config = config;
    //    }

    //    // 🔹 פונקציה לרישום משתמשים חדשים
    //    public async Task<AuthResultDto> Register(RegisterDto registerDto)
    //    {
    //        if (await _userRepository.GetUserByEmailAsync(registerDto.Email) != null)
    //            return new AuthResultDto { Success = false, Message = "Email already exists" };

    //        var user = new User
    //        {
    //            Name = registerDto.Name,
    //            Email = registerDto.Email,
    //            Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password) // 🔹 הצפנת סיסמה
    //        };

    //        _userRepository.AddItem(user);

    //        return new AuthResultDto { Success = true, Token = GenerateToken(user) };
    //    }

    //    // 🔹 פונקציה להתחברות משתמשים קיימים
    //    public async Task<string> Authenticate(LoginDto loginDto)
    //    {
    //        var user = await _userRepository.GetUserByEmailAsync(loginDto.Email);
    //        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
    //            return null;

    //        return GenerateToken(user);
    //    }

    //    private string GenerateToken(User user)
    //    {
    //        var claims = new[]
    //        {
    //            new Claim(ClaimTypes.Name, user.Name ?? ""),
    //            new Claim(ClaimTypes.Email, user.Email ?? ""),
    //            new Claim("UserId", user.UserId.ToString())
    //        };

    //        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]));
    //        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    //        var token = new JwtSecurityToken(
    //            issuer: _config["Jwt:Issuer"],
    //            audience: _config["Jwt:Audience"],
    //            claims: claims,
    //            expires: DateTime.UtcNow.AddHours(2),
    //            signingCredentials: creds
    //        );

    //        return new JwtSecurityTokenHandler().WriteToken(token);
    //    }
    //}
}
