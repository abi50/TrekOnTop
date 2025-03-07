using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class RecommendationLikeRepository : IRepository<RecommendationLike>
    {
        private readonly IContext context;

        public RecommendationLikeRepository(IContext context)
        {
            this.context = context;
        }

        public RecommendationLike AddItem(RecommendationLike item)
        {
            context.RecommendationLikes.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var like = Get(id);
            if (like != null)
            {
                context.RecommendationLikes.Remove(like);
                context.save();
            }
        }

        public RecommendationLike Get(int id)
        {
            return context.RecommendationLikes.FirstOrDefault(x => x.Id == id);
        }

        public List<RecommendationLike> GetAll()
        {
            return context.RecommendationLikes.ToList();
        }

        public RecommendationLike UpdateItem(int id, RecommendationLike item)
        {
            var like = Get(id);
            if (like == null) throw new KeyNotFoundException("Like not found.");
            like.IsLike = item.IsLike;
            context.save();
            return like;
        }
    }

}
