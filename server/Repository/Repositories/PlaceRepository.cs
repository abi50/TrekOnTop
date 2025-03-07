using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class PlaceRepository:IRepository<Place>
    {
        private readonly IContext context;
        public PlaceRepository(IContext context)
        {
            this.context = context;
        }

        public Place AddItem(Place item)
        {
            context.Places.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var place = Get(id);
            if (place != null)
            {
                context.Places.Remove(place);   
                context.save();
            }
        }

        public Place Get(int id)
        {
            return context.Places.FirstOrDefault(x => x.PlaceId == id);
        }

        public List<Place> GetAll()
        {
            return context.Places.ToList();
        }

        public Place UpdateItem(int id, Place item)
        {

            var place = Get(id);
            if (place == null) throw new KeyNotFoundException("place not found.");
            place.Longitude=item.Longitude; 
            place.Latitude=item.Latitude;
            place.City=item.City;
            place.Category =item.Category;
            
            context.save();
            return place;
        }
    }
}
