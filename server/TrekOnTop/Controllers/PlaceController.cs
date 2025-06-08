using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class PlaceController : ControllerBase
{
    private readonly IPlaceService _placeService;
    private readonly IService<CityDto> _cityService;
    private readonly IService<RecommendationDto> _recommendationService;

    public PlaceController(IPlaceService placeService, IService<CityDto> cityService, IService<RecommendationDto> recommendationService)
    {
        _placeService = placeService;
        _cityService = cityService;
        _recommendationService = recommendationService;
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
    [HttpGet("search")]
    public IActionResult SmartSearch([FromQuery] double lat, [FromQuery] double lng, [FromQuery] double radius, [FromQuery] int categoryId)
    {
        var places = _placeService.GetAll()
            .Where(p =>
                p.CategoryId == categoryId &&
                GetDistance(lat, lng, p.Latitude, p.Longitude) <= radius)
            .ToList();

        return Ok(places);
    }
    private double GetDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371; // רדיוס כדור הארץ בקילומטרים
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
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
    [HttpGet("topWithMostRecommendations")]
    public IActionResult GetTopPlaces()
    {
        var placesWithCount = _placeService.GetAll()
            .Select(p => new
            {
                Place = p,
                RecommendationCount = _recommendationService.GetAll().Count(r => r.PlaceId == p.PlaceId)
            })
            .OrderByDescending(p => p.RecommendationCount)
            .Take(4)
            .Select(p => p.Place)
            .ToList();

        return Ok(placesWithCount);
    }

}
