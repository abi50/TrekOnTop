using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IAuthService
    {
        string Login(LoginDto loginData);
        string Register(UserDto newUser);
        bool VerifyPassword(int userId, string password);
        void ChangePassword(int userId, string newPassword);
        UserDto GetUserById(int userId);
    }

}
