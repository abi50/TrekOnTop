using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mock
{
    public class MyDatabase : DbContext, IContext
    {
        public DbSet<User> Users { get; set ; }
        public DbSet<Recommendation> Recommendations { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<RecommendationLike> RecommendationLikes { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("server=LAPTOP-8RM4IF3S\\SQLEXPRESS;database=trek_on_top;trusted_connection=true;");
            //sqlServerOptions => sqlServerOptions.EnableRetryOnFailure());
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ❌ ביטול מחיקה Cascading ב-UserId כדי למנוע בעיה של מסלולים מרובים
            modelBuilder.Entity<RecommendationLike>()
                .HasOne(rl => rl.User)
                .WithMany()
                .HasForeignKey(rl => rl.UserId)
                .OnDelete(DeleteBehavior.NoAction); // ✅ שינוי ל-"NO ACTION"

            // ✅ השארת מחיקה Cascading בקשר ל-Recommendation
            modelBuilder.Entity<RecommendationLike>()
                .HasOne(rl => rl.Recommendation)
                .WithMany(r => r.RecommendationLikes)
                .HasForeignKey(rl => rl.RecoId)
                .OnDelete(DeleteBehavior.Cascade);
        }





        public void save()
        {
            SaveChanges();
        }
    }
}
