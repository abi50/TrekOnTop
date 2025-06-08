using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class ImageController : ControllerBase
{
    private readonly IImageService _imageService;

    public ImageController(IImageService imageService)
    {
        _imageService = imageService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_imageService.GetAll());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        try { return Ok(_imageService.GetById(id)); }
        catch (Exception ex) { return NotFound(ex.Message); }
    }

    [HttpPost]
    public IActionResult Post([FromForm] ImageDto value)
    {
        var created = _imageService.AddItem(value);
        return Ok(created);
    }

    [Authorize]
    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] ImageDto value)
    {
        try
        {
            _imageService.Update(id, value);
            return Ok("Image updated.");
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _imageService.Delete(id);
            return Ok("Image deleted.");
        }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }

    [HttpGet("getimage/{id}")]
    public IActionResult GetImage(int id)
    {
        try
        {
            var path = _imageService.GetImagePath(id);
            if (!System.IO.File.Exists(path))
                return NotFound("File not found on server.");

            return PhysicalFile(path, "image/jpeg");
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}
