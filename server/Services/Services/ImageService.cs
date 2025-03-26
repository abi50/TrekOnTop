using AutoMapper;
using Common.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System.Security.Claims;

public class ImageService : IImageService
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
        _httpContextAccessor = httpContextAccessor;
        _imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", configuration["ImagesFolder"]);
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : throw new Exception("User not authenticated.");
    }

    public ImageDto AddItem(ImageDto item)
    {
        if (item.File != null && item.File.Length > 0)
        {
            if (!Directory.Exists(_imagesFolder))
                Directory.CreateDirectory(_imagesFolder);

            var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(item.File.FileName)}";
            var filePath = Path.Combine(_imagesFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            item.File.CopyTo(stream);

            item.Url = $"/Images/{fileName}";
        }

        var image = _mapper.Map<Image>(item);
        _repository.AddItem(image);
        return _mapper.Map<ImageDto>(image);
    }

    public void Delete(int id)
    {
        var image = _repository.Get(id);
        if (image == null) throw new Exception("Image not found.");

        var recommendation = _recommendationRepository.Get(image.RecommendationId);
        if (recommendation == null || recommendation.UserId != GetCurrentUserId())
            throw new Exception("Unauthorized. Only the owner can delete.");

        _repository.DeleteItem(id);
    }

    public List<ImageDto> GetAll() =>
        _repository.GetAll().Select(_mapper.Map<ImageDto>).ToList();

    public ImageDto GetById(int id)
    {
        var image = _repository.Get(id);
        if (image == null) throw new Exception("Image not found.");
        return _mapper.Map<ImageDto>(image);
    }

    public ImageDto Update(int id, ImageDto item)
    {
        var existing = _repository.Get(id);
        if (existing == null) throw new Exception("Image not found.");
        return _mapper.Map<ImageDto>(_repository.UpdateItem(id, _mapper.Map(item, existing)));
    }

    public string GetImagePath(int id)
    {
        var image = _repository.Get(id);
        if (image == null || string.IsNullOrEmpty(image.Url))
            throw new Exception("Image not found.");

        return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", image.Url.TrimStart('/'));
    }
}
