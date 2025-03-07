using Microsoft.EntityFrameworkCore;
using Repository.Entity;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Repositories

{
    public class UserRepository : IRepository<User>
    {
        private readonly IContext context;
        public UserRepository(IContext context)
        {
            this.context = context;
        }

        public User AddItem(User item)
        {
            context.Users.Add(item);
            context.save();
            return item;
        }

        public void DeleteItem(int id)
        {
            var user = Get(id);
            if (user != null)
            {
                context.Users.Remove(user);
                context.save();
            }
        }

        public User Get(int id)
        {
            return context.Users.FirstOrDefault(x => x.UserId == id);
        }

        public List<User> GetAll()
        {
            return context.Users.ToList();
        }

        public User UpdateItem(int id, User item)
        {
            var user = Get(id);
            if (user == null) throw new KeyNotFoundException("User not found.");

            user.Name = item.Name;
            user.Email = item.Email;
            user.Password = item.Password;
            user.ProfilPic = item.ProfilPic;

            context.save();
            return user;
        }
        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

    }

}
