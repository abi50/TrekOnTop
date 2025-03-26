using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;

public class CategoryService : ICategoryService
{
    private readonly IRepository<Category> _repository;
    private readonly IMapper _mapper;

    public CategoryService(IRepository<Category> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public CategoryDto AddItem(CategoryDto item)
    {
        var category = _mapper.Map<Category>(item);
        _repository.AddItem(category);
        return _mapper.Map<CategoryDto>(category);
    }

    public void Delete(int id)
    {
        _repository.DeleteItem(id);
    }

    public List<CategoryDto> GetAll()
    {
        var categories = _repository.GetAll();
        return _mapper.Map<List<CategoryDto>>(categories);
    }

    public CategoryDto GetById(int id)
    {
        var category = _repository.Get(id);
        return _mapper.Map<CategoryDto>(category);
    }

    public CategoryDto Update(int id, CategoryDto item)
    {
        var category = _mapper.Map<Category>(item);
        var updated = _repository.UpdateItem(id, category);
        return _mapper.Map<CategoryDto>(updated);
    }

    public CategoryDto GetByName(string name)
    {
        var category = _repository.GetAll().FirstOrDefault(c => c.Name == name && !c.IsDeleted);
        return _mapper.Map<CategoryDto>(category);
    }

    public bool Exists(string name)
    {
        return _repository.GetAll().Any(c => c.Name == name && !c.IsDeleted);
    }
}
