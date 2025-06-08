using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IPlaceService : IService<PlaceDto>
    {
        List<PlaceDto> GetNearbyPlaces(double lat, double lng, double radius);
        bool PlaceExists(double lat, double lng, out int placeId);
        List<PlaceDto> GetPaged(int page, int limit);
        List<PlaceDto> GetByCountry(int countryId, List<CityDto> allCities);
    }

}
