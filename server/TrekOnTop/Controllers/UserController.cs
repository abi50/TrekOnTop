using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Security.Cryptography;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_userService.GetAll());

    [Authorize]
    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var currentUserId = _userService.GetCurrentUserId();
        if (id != currentUserId) return Forbid();

        var user = _userService.GetById(id);
        return user != null ? Ok(user) : NotFound();
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
        if (existingUser == null) return NotFound("User not found.");

        value.Password = !string.IsNullOrEmpty(value.Password)
            ? HashPassword(value.Password)
            : existingUser.Password;

        if (value.File == null)
            value.ProfilPic = existingUser.ProfilPic;
        value.Name = string.IsNullOrEmpty(value.Name) ? existingUser.Name : value.Name;
        value.Email = string.IsNullOrEmpty(value.Email) ? existingUser.Email : value.Email;

        _userService.Update(id, value);
        return Ok("User updated successfully");
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _userService.DeleteWithAuth(id);
            return Ok("User deleted successfully.");
        }
        catch (Exception ex)
        {
            return Forbid(ex.Message);
        }
    }

    [HttpGet("getimage/{id}")]
    public IActionResult GetImage(int id)
    {
        try
        {
            var path = _userService.GetProfileImagePath(id);
            if (!System.IO.File.Exists(path)) return NotFound("Image file not found.");
            return PhysicalFile(path, "image/jpeg");
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }
}
