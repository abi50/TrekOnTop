using Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ICategoryService : IService<CategoryDto>
    {
        CategoryDto GetByName(string name);
        bool Exists(string name);
    }

}
