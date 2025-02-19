using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class ImageRepository:IRepository<Image>
    {
        
            private readonly IContext context;
            public ImageRepository(IContext context)
            {
                this.context = context;
            }

            public Image AddItem(Image item)
            {
                context.Images.Add(item);
                context.save();
                return item;
            }

            public void DeleteItem(int id)
            {
                var image = Get(id);
                if (image != null)
                {
                   context.Images.Remove(image);
                   context.save();
                }
            }

            public Image Get(int id)
            {
                return context.Images.FirstOrDefault(x => x.ImageId == id);
            }

            public List<Image> GetAll()
            {
                return context.Images.ToList();
            }

            public Image UpdateItem(int id, Image item)
            {

                var image = Get(id);
                if (image == null) throw new KeyNotFoundException("image not found.");
                image.Url = item.Url;
                image.Recommendation = item.Recommendation;
                context.save();
                return image;
            }
    }
}
