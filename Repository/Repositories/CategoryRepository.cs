using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories
{
    public class CategoryRepository : IRepository<Category>
    {
        private readonly IContext context;
        public CategoryRepository(IContext context)
        {
            this.context = context;
        }

        public Category AddItem(Category item)
        {
            context.Categories.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var category = Get(id);
            if (category != null)
            {
                category.IsDeleted = true;
                context.save();
            }
        }

        public Category Get(int id)
        {
            return context.Categories.FirstOrDefault(x => x.CategoryId == id);
        }

        public List<Category> GetAll()
        {
            return context.Categories.Where(x => !x.IsDeleted).ToList();
        }

        public Category UpdateItem(int id, Category item)
        {
           
            var category = Get(id);
            if (category == null) throw new KeyNotFoundException("Category not found.");
            category.Name = item.Name;
            context.save();
            return category;
        }
    }

}
