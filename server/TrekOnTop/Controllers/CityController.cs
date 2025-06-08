using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class CityController : ControllerBase
{
    private readonly ICityService _cityService;

    public CityController(ICityService cityService)
    {
        _cityService = cityService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_cityService.GetAll());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        try
        {
            return Ok(_cityService.GetById(id));
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpPost]
    public IActionResult Post([FromForm] CityDto value)
    {
        if (string.IsNullOrEmpty(value.Name))
            return BadRequest("City name is required.");

        var newCity = _cityService.AddItem(value);
        return CreatedAtAction(nameof(Post), new { id = newCity.Id }, newCity);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromForm] CityDto value)
    {
        try
        {
            _cityService.Update(id, value);
            return Ok("City updated.");
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        try
        {
            _cityService.Delete(id);
            return Ok("City deleted.");
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    [HttpGet("byName")]
    public IActionResult GetCityByName([FromQuery] string cityName)
    {
        var city = _cityService.GetByName(cityName);
        return city == null ? NotFound("City not found.") : Ok(city);
    }
}
