using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class CityRepository : IRepository<City>
    {
        private readonly IContext context;
        public CityRepository(IContext context)
        {
            this.context = context;
        }

        public City AddItem(City item)
        {
            context.Cities.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var city = Get(id);
            if (city != null)
            {
                context.Cities.Remove(city);
                context.save();
            }
        }

        public City Get(int id)
        {
            return context.Cities.FirstOrDefault(x => x.Id == id);
        }

        public List<City> GetAll()
        {
            return context.Cities.ToList();
        }

        public City UpdateItem(int id, City item)
        {
            var city = Get(id);
            if (city == null) throw new KeyNotFoundException("city not found.");
            city.Name = item.Name;
            city.Country = context.Countries.FirstOrDefault(country=> country.CountryId==item.CountryId);
            context.save();
            return city;
        }
    }

}
