using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IUserService : IService<UserDto>
    {
        int GetCurrentUserId();
        void DeleteWithAuth(int id);
        string GetProfileImagePath(int id);
    }

}
