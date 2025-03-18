using AutoMapper;
using Common.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Repository.Entity;
using Repository.Interfaces;
using Repository.Repositories;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class ImageService :IService<ImageDto>
    {
      
            private readonly IRepository<Image> _repository;
            private readonly IRepository<Recommendation> _recommendationRepository;
            private readonly IHttpContextAccessor _httpContextAccessor;
            private readonly IMapper _mapper;
            private readonly string _imagesFolder;


        public ImageService(
        IRepository<Image> repository,
        IRepository<Recommendation> recommendationRepository, 
        IMapper mapper,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _recommendationRepository = recommendationRepository; 
            _mapper = mapper;
            _imagesFolder = Path.Combine(Environment.CurrentDirectory, configuration["ImagesFolder"]);
            _httpContextAccessor = httpContextAccessor;
        }


        private int GetCurrentUserId()
        {
            var httpContextAccessor = new HttpContextAccessor();
            var userIdClaim = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : throw new Exception("User not authenticated.");
        }
        public ImageDto AddItem(ImageDto item)
        {
            Console.WriteLine("Start AddItem");
            if (item.File != null && item.File.Length > 0)
            {
                Console.WriteLine($"File detected: {item.File.FileName}");
                if (!Directory.Exists(_imagesFolder))
                {
                    Console.WriteLine("Creating images folder.");
                    Directory.CreateDirectory(_imagesFolder);
                }
                var imagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Images");
                if (!Directory.Exists(imagesPath))
                {
                    Directory.CreateDirectory(imagesPath);
                }
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(item.File.FileName)}";
                var filePath = Path.Combine(imagesPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    item.File.CopyTo(stream);
                }

                item.Url = $"/Images/{fileName}";

            }

            Console.WriteLine("Mapping to Image entity.");
            var image = _mapper.Map<Image>(item);
            Console.WriteLine("Saving to repository.");
            _repository.AddItem(image);
            Console.WriteLine("Saved successfully.");

            return _mapper.Map<ImageDto>(image);
        }

        public void Delete(int id)
        {
            var currentUserId = GetCurrentUserId();
            var image = _repository.Get(id);
            if (image == null)
                throw new Exception("Image not found.");

            var recommendation = _recommendationRepository.Get(image.RecommendationId);
            if (recommendation == null || recommendation.UserId != currentUserId)
                throw new Exception("Unauthorized. You can only delete images from your own recommendations.");

            _repository.DeleteItem(id);
        }

        public List<ImageDto> GetAll()
            {
                return _repository.GetAll().Select(city => _mapper.Map<ImageDto>(city)).ToList();
            }

            public ImageDto GetById(int id)
            {
                var image = _repository.Get(id);
                if (image == null)
                    throw new Exception($"image with ID {id} not found.");

                return _mapper.Map<ImageDto>(image);
            }

            public ImageDto Update(int id, ImageDto item)
            {
                var existingImage = _repository.Get(id);
                if (existingImage == null)
                    throw new Exception($"image with ID {id} not found.");

                return _mapper.Map<ImageDto>(_repository.UpdateItem(id, _mapper.Map(item, existingImage)));
            }
        }
}
