using Common.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using System.Security.Claims;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlaceController: ControllerBase
    {
        
            private readonly IService<PlaceDto> _placeService;
            public PlaceController(IService<PlaceDto> placeService)
            {
                _placeService = placeService;
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

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
            public void Delete(int id)
            {
                _placeService.Delete(id);
            }
        }
    }

