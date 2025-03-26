using AutoMapper;
using Common.Dtos;
using Repository.Entity;
using Repository.Interfaces;
using Services.Interfaces;

public class PlaceService : IPlaceService
{
    private readonly IRepository<Place> _repository;
    private readonly IMapper _mapper;

    public PlaceService(IRepository<Place> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public PlaceDto AddItem(PlaceDto item)
    {
        var place = _mapper.Map<Place>(item);
        _repository.AddItem(place);
        return _mapper.Map<PlaceDto>(place);
    }

    public void Delete(int id) => _repository.DeleteItem(id);

    public List<PlaceDto> GetAll()
    {
        return _mapper.Map<List<PlaceDto>>(_repository.GetAll());
    }

    public PlaceDto GetById(int id)
    {
        var place = _repository.Get(id);
        return _mapper.Map<PlaceDto>(place);
    }

    public PlaceDto Update(int id, PlaceDto item)
    {
        var place = _mapper.Map<Place>(item);
        _repository.UpdateItem(id, place);
        return _mapper.Map<PlaceDto>(place);
    }

    public List<PlaceDto> GetNearbyPlaces(double lat, double lng, double radius)
    {
        return GetAll()
            .Where(p => GetDistance(lat, lng, p.Latitude, p.Longitude) <= radius)
            .ToList();
    }

    public bool PlaceExists(double lat, double lng, out int placeId)
    {
        var match = GetAll().FirstOrDefault(p => p.Latitude == lat && p.Longitude == lng);
        if (match != null)
        {
            placeId = match.PlaceId;
            return true;
        }
        placeId = 0;
        return false;
    }

    public List<PlaceDto> GetPaged(int page, int limit)
    {
        return GetAll()
            .OrderByDescending(p => p.PlaceId)
            .Skip((page - 1) * limit)
            .Take(limit)
            .ToList();
    }

    public List<PlaceDto> GetByCountry(int countryId, List<CityDto> allCities)
    {
        var cityIds = allCities.Where(c => c.CountryId == countryId).Select(c => c.Id).ToList();
        return GetAll().Where(p => cityIds.Contains(p.CityId)).ToList();
    }

    private double GetDistance(double lat1, double lon1, double lat2, double lon2)
    {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;

        var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

        var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        return R * c;
    }
}
