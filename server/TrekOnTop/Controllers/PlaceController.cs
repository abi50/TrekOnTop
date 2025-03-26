using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class PlaceController : ControllerBase
{
    private readonly IPlaceService _placeService;
    private readonly IService<CityDto> _cityService;

    public PlaceController(IPlaceService placeService, IService<CityDto> cityService)
    {
        _placeService = placeService;
        _cityService = cityService;
    }

    [HttpGet]
    public IActionResult Get() => Ok(_placeService.GetAll());

    [HttpGet("paged")]
    public IActionResult GetPagedPlaces([FromQuery] int page = 1, [FromQuery] int limit = 10)
    {
        return Ok(_placeService.GetPaged(page, limit));
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var place = _placeService.GetById(id);
        return place == null ? NotFound("Place not found") : Ok(place);
    }

    [HttpPost]
    public IActionResult Post([FromBody] PlaceDto value)
    {
        if (string.IsNullOrEmpty(value.PlaceName))
            return BadRequest("Place name is required.");

        var newPlace = _placeService.AddItem(value);
        return CreatedAtAction(nameof(Post), new { id = newPlace.PlaceId }, newPlace);
    }

    [HttpPut("{id}")]
    public IActionResult Put(int id, [FromBody] PlaceDto value)
    {
        if (_placeService.GetById(id) == null)
            return NotFound("Place not found.");

        _placeService.Update(id, value);
        return Ok("Place updated successfully.");
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _placeService.Delete(id);
        return Ok("Place deleted.");
    }

    [HttpGet("nearby")]
    public IActionResult GetPlacesNearby([FromQuery] double lat, [FromQuery] double lng, [FromQuery] double radius)
    {
        return Ok(_placeService.GetNearbyPlaces(lat, lng, radius));
    }

    [HttpGet("checkIfPlaceExists")]
    public IActionResult CheckIfPlaceExists([FromQuery] double? lat, [FromQuery] double? lng)
    {
        if (lat == null || lng == null)
            return BadRequest("Latitude and Longitude are required.");

        if (_placeService.PlaceExists(lat.Value, lng.Value, out int placeId))
            return Ok(new { placeId });

        return NotFound("No place found");
    }

    [HttpGet("byCountry/{countryId}")]
    public IActionResult GetPlacesByCountry(int countryId)
    {
        var cities = _cityService.GetAll();
        var results = _placeService.GetByCountry(countryId, cities);
        return results.Any() ? Ok(results) : NotFound("No places found in this country.");
    }
}
