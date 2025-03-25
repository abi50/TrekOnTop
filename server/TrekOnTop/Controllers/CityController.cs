using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityController: ControllerBase
    {

        private readonly IService<CityDto> _cityService;
        public CityController(IService<CityDto> cityService)
        {
            _cityService = cityService;
        }

        // GET: api/<UserController>
        [HttpGet]
        public List<CityDto> Get()
        {
            return _cityService.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public CityDto Get(int id)
        {
            return _cityService.GetById(id);
        }

        // POST api/<UserController>
        [HttpPost]
        public IActionResult Post([FromForm] CityDto value)
        {
            if (string.IsNullOrEmpty(value.Name))
                return BadRequest("City name is required.");

            var newCity = _cityService.AddItem(value);
            return CreatedAtAction(nameof(Post), new { id = newCity.Id }, newCity);
        }


        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromForm] CityDto value)
        {
            _cityService.Update(id, value);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _cityService.Delete(id);
        }

        [HttpGet("byName")]
        public IActionResult GetCityByName([FromQuery] string cityName)
        {
            var city = _cityService.GetAll().FirstOrDefault(c => c.Name == cityName );
            if (city == null)
                return NotFound("City not found.");
            return Ok(city);
        }

    }
}
