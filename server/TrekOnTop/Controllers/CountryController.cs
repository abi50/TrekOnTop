using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class CountryController : ControllerBase
{
    private readonly ICountryService _countryService;
    private readonly IService<CityDto> _cityService;
    private readonly IService<PlaceDto> _placeService;

    public CountryController(ICountryService countryService, IService<CityDto> cityService, IService<PlaceDto> placeService)
    {
        _countryService = countryService;
        _cityService = cityService;
        _placeService = placeService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_countryService.GetAll());

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var country = _countryService.GetById(id);
        return country == null ? NotFound() : Ok(country);
    }

    [HttpPost]
    public IActionResult Post([FromForm] CountryDto value)
    {
        if (string.IsNullOrEmpty(value.CountryName))
            return BadRequest("Country name is required.");

        var newCountry = _countryService.AddItem(value);
        return CreatedAtAction(nameof(Post), new { id = newCountry.CountryId }, newCountry);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromForm] CountryDto value)
    {
        _countryService.Update(id, value);
        return Ok("Country updated.");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _countryService.Delete(id);
        return Ok("Country deleted.");
    }

    [HttpGet("byName")]
    public IActionResult GetCountryByName([FromQuery] string countryCode)
    {
        var country = _countryService.GetByCode(countryCode);
        return country == null ? NotFound("Country not found.") : Ok(country);
    }
    [HttpGet("mostPopular")]
    public IActionResult GetMostPopularCountries()
    {
        var cities = _cityService.GetAll();
        var places = _placeService.GetAll();
        var countries = _countryService.GetAll();

        var result = countries
            .Select(c => new
            {
                Country = c,
                PlaceCount = cities.Where(city => city.CountryId == c.CountryId)
                                   .SelectMany(city => places.Where(p => p.CityId == city.Id)).Count()
            })
            .OrderByDescending(x => x.PlaceCount)
            .Take(5)
            .Select(x => x.Country)
            .ToList();

        return Ok(result);
    }

}
