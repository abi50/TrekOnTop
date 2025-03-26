using AutoMapper;
using Common.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;
using System.Security.Claims;

public class UserService : IUserService
{
    private readonly IRepository<User> _repository;
    private readonly IMapper _mapper;
    private readonly string _imagesFolder;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(IRepository<User> repository, IMapper mapper, IConfiguration config, IHttpContextAccessor httpContextAccessor)
    {
        _repository = repository;
        _mapper = mapper;
        _imagesFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", config["ImagesFolder"]);
        _httpContextAccessor = httpContextAccessor;
    }

    public int GetCurrentUserId()
    {
        var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) throw new Exception("User not authenticated.");
        return int.Parse(userId);
    }

    public UserDto AddItem(UserDto item)
    {
        if (item.File != null && item.File.Length > 0)
            item.ProfilPic = SaveImageToDisk(item.File);

        var user = _mapper.Map<User>(item);
        _repository.AddItem(user);
        return _mapper.Map<UserDto>(user);
    }

    public UserDto Update(int id, UserDto item)
    {
        if (item.File != null && item.File.Length > 0)
            item.ProfilPic = SaveImageToDisk(item.File);

        var user = _mapper.Map<User>(item);
        var updated = _repository.UpdateItem(id, user);
        return _mapper.Map<UserDto>(updated);
    }

    public void DeleteWithAuth(int id)
    {
        var currentUserId = GetCurrentUserId();
        var user = _repository.Get(id) ?? throw new Exception("User not found.");
        if (user.UserId != currentUserId)
            throw new Exception("Unauthorized.");

        _repository.DeleteItem(id);
    }

    public void Delete(int id) => _repository.DeleteItem(id);

    public List<UserDto> GetAll() => _mapper.Map<List<UserDto>>(_repository.GetAll());

    public UserDto GetById(int id) => _mapper.Map<UserDto>(_repository.Get(id));

    public string GetProfileImagePath(int id)
    {
        var user = _repository.Get(id);
        if (user?.ProfilPic == null) throw new Exception("Image not found.");
        return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", user.ProfilPic.TrimStart('/'));
    }

    private string SaveImageToDisk(IFormFile file)
    {
        if (!Directory.Exists(_imagesFolder)) Directory.CreateDirectory(_imagesFolder);

        var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var path = Path.Combine(_imagesFolder, fileName);
        using var stream = new FileStream(path, FileMode.Create);
        file.CopyTo(stream);

        return $"/Images/{fileName}";
    }
}
