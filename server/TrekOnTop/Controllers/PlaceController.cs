using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Services;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceController: ControllerBase
    {
        
            private readonly IService<PlaceDto> _placeService;
            private readonly IService<CityDto> _cityService;

        public PlaceController(IService<PlaceDto> placeService, IService<CityDto> cityService)
            {
                _placeService = placeService;
                _cityService = cityService;
            }

            // GET: api/<UserController>
            [HttpGet]
            public List<PlaceDto> Get()
            {
                return _placeService.GetAll();
            }

            // GET api/<UserController>/5
            [HttpGet("{id}")]
            public PlaceDto Get(int id)
            {
                return _placeService.GetById(id);
            }

            // POST api/<UserController>
            [HttpPost]
            public void Post([FromForm] PlaceDto value)
            {
                _placeService.AddItem(value);
            }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] PlaceDto value)
        {
            var place = _placeService.GetById(id);

            if (place == null)
            {
                return NotFound("Place not found.");
            }
            _placeService.Update(id, value);
            return Ok("Place updated successfully.");
        }
        [HttpGet("nearby")]
        public IActionResult GetPlacesNearby(double lat, double lng, double radius)
        {
            var places = _placeService.GetAll()
                .Where(p => GetDistance(lat, lng, p.Latitude, p.Longitude) <= radius)
                .ToList();

            return Ok(places);
        }

        // מתודה לחישוב מרחק בין שתי נקודות
        private double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371; // רדיוס כדור הארץ בק"מ
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c; // החזרת המרחק בקילומטרים
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
         public void Delete(int id)
         {
             _placeService.Delete(id);
         }

        [HttpGet("byCountry/{countryId}")]
        public IActionResult GetPlacesByCountry(int countryId)
        {
            // שלב 1: קבלת כל הערים במדינה
            var citiesInCountry = _cityService.GetAll()
                                              .Where(c => c.CountryId == countryId)
                                              .Select(c => c.Id) // שליפת מזהי ערים
                                              .ToList();

            if (!citiesInCountry.Any())
            {
                return NotFound($"No cities found in country with ID {countryId}.");
            }

            // שלב 2: חיפוש כל המקומות שנמצאים באותן ערים
            var places = _placeService.GetAll()
                                      .Where(p => citiesInCountry.Contains(p.CityId))
                                      .ToList();

            if (!places.Any())
            {
                return NotFound($"No places found in country with ID {countryId}.");
            }

            return Ok(places);
        }


    }

}

