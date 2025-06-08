using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class GooglePlacesController : ControllerBase
{
    private readonly IGooglePlacesService _googlePlacesService;

    public GooglePlacesController(IGooglePlacesService googlePlacesService)
    {
        _googlePlacesService = googlePlacesService;
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearbyPlaces([FromQuery] double lat, [FromQuery] double lng)
    {
        try
        {
            var content = await _googlePlacesService.GetNearbyPlacesAsync(lat, lng);
            return Content(content, "application/json");
        }
        catch
        {
            return StatusCode(500, "Failed to fetch data from Google Places API");
        }
    }

    [HttpGet("details")]
    public async Task<IActionResult> GetPlaceDetails([FromQuery] string placeId)
    {
        try
        {
            var content = await _googlePlacesService.GetPlaceDetailsAsync(placeId);
            return Content(content, "application/json");
        }
        catch
        {
            return StatusCode(500, "Failed to fetch place details from Google API");
        }
    }

    [HttpGet("searchByText")]
    public async Task<IActionResult> SearchByText([FromQuery] string query)
    {
        try
        {
            var content = await _googlePlacesService.SearchByTextAsync(query);
            return Content(content, "application/json");
        }
        catch
        {
            return StatusCode(500, "Failed to fetch data from Google Text Search API");
        }
    }
}
