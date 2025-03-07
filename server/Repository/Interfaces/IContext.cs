using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IContext
    {
        DbSet<User> Users { get; set; }
        DbSet<Recommendation> Recommendations { get; set; }
        DbSet<Category> Categories { get; set; }
        DbSet<City> Cities { get; set; }
        DbSet<Country> Countries { get; set; }
        DbSet<Place> Places { get; set; }
        DbSet<Image> Images { get; set; }
        DbSet<RecommendationLike> RecommendationLikes { get; set; } 


        void save();
    }
}
