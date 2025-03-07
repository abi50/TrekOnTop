using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Country
    {
        [Key] 
        public int CountryId { get; set; } 
        public string CountryName { get; set; } 
        public string CountryCode { get; set; } // קוד המדינה (למשל "IT")
        public ICollection<City> Cities { get; set; }
    }


}
