using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountryController: ControllerBase
    {
        private readonly IService<CountryDto> _countryService;
        public CountryController(IService<CountryDto> countryService)
        {
            _countryService = countryService;
        }

        // GET: api/<UserController>
        [HttpGet]
        public List<CountryDto> Get()
        {
            return _countryService.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public CountryDto Get(int id)
        {
            return _countryService.GetById(id);
        }

        // POST api/<UserController>
        [HttpPost]
        public IActionResult Post([FromForm] CountryDto value)
        {
            if (string.IsNullOrEmpty(value.CountryName))
                return BadRequest("Country name is required.");

            var newCountry = _countryService.AddItem(value);
            return CreatedAtAction(nameof(Post), new { id = newCountry.CountryId }, newCountry);
        }


        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromForm] CountryDto value)
        {
            _countryService.Update(id, value);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _countryService.Delete(id);
        }

        [HttpGet("byName")]
        public IActionResult GetCountryByName( [FromQuery] string countryCode)
        {
            var country = _countryService.GetAll()
                .FirstOrDefault(c => c.CountryCode == countryCode);

            if (country == null)
                return NotFound("Country not found.");

            return Ok(country);
        }



    }
}
