using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class RecommendationRepository : IRepository<Recommendation>
    {
        private readonly IContext context;
        public RecommendationRepository(IContext context)
        {
            this.context = context;
        }

        public Recommendation AddItem(Recommendation item)
        {
            context.Recommendations.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var recommendation = Get(id);
            if (recommendation != null)
            {
                context.Recommendations.Remove(recommendation);
                context.save();
            }
        }

        public Recommendation Get(int id)
        {
            return context.Recommendations.FirstOrDefault(x => x.RecoId == id);
        }

        public List<Recommendation> GetAll()
        {
            return context.Recommendations.ToList();
        }

        public Recommendation UpdateItem(int id, Recommendation item)
        {
            var recommendation = Get(id);
            if (recommendation == null) throw new KeyNotFoundException("Recommendation not found.");
            recommendation.Place = item.Place;
            recommendation.Title = item.Title;
            recommendation.Description = item.Description;
            recommendation.Likes = item.Likes;
            recommendation.Dislikes = item.Dislikes;

            context.save();
            return recommendation;
        }
    }

}
