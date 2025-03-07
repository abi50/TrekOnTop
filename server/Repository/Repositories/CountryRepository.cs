using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class CountryRepository : IRepository<Country>
    {
        private readonly IContext context;
        public CountryRepository(IContext context)
        {
            this.context = context;
        }

        public Country AddItem(Country item)
        {
            context.Countries.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var country = Get(id);
            if (country != null)
            {
                context.Countries.Remove(country);
                context.save();
            }
        }

        public Country Get(int id)
        {
            return context.Countries.FirstOrDefault(x => x.CountryId == id);
        }

        public List<Country> GetAll()
        {
            return context.Countries.ToList();
        }

        public Country UpdateItem(int id, Country item)
        {
            var country = Get(id);
            if (country == null) throw new KeyNotFoundException("country not found.");
            country.CountryId = item.CountryId;
            country.Cities = item.Cities;
            context.save();
            return country;
        }
    }

}
