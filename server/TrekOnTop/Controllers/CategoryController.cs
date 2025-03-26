using Common.Dtos;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace TrekOnTop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController:ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }


        // GET: api/<UserController>
        [HttpGet]
        public List<CategoryDto> Get()
        {
            return _categoryService.GetAll();
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public CategoryDto Get(int id)
        {
            return _categoryService.GetById(id);
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post([FromForm] CategoryDto value)
        {
            _categoryService.AddItem(value);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromForm] CategoryDto value)
        {
            _categoryService.Update(id, value);
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            _categoryService.Delete(id);
        }
    }
}
