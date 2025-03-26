using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IGooglePlacesService
    {
        Task<string> GetNearbyPlacesAsync(double lat, double lng);
        Task<string> GetPlaceDetailsAsync(string placeId);
        Task<string> SearchByTextAsync(string query);
    }

}
