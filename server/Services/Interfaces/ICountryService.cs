using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICountryService : IService<CountryDto>
    {
        CountryDto GetByCode(string countryCode);
    }

}
