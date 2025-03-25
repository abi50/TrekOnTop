using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

namespace TrekOnTop.Controllers 
{
    [Route("api/[controller]")]
    [ApiController]
    public class GooglePlacesController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public GooglePlacesController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearbyPlaces([FromQuery] double lat, [FromQuery] double lng)
        {
            var apiKey = _configuration["GoogleMaps:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("Missing Google API Key");

            var url = $"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=50&key={apiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();
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
            var apiKey = _configuration["GoogleMaps:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("Missing Google API Key");

            var url = $"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&fields=name,formatted_address,photos,website&key={apiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();
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
            var apiKey = _configuration["GoogleMaps:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
                return BadRequest("Missing Google API Key");

            var url = $"https://maps.googleapis.com/maps/api/place/textsearch/json?query={Uri.EscapeDataString(query)}&key={apiKey}";

            try
            {
                var response = await _httpClient.GetAsync(url);
                var content = await response.Content.ReadAsStringAsync();
                return Content(content, "application/json");
            }
            catch
            {
                return StatusCode(500, "Failed to fetch data from Google Text Search API");
            }
        }

    }
}
