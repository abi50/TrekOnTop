using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class City
    {
        [Key] public int Id { get; set; }
        public string Name { get; set; }

        [ForeignKey("CountryId")]
        public int CountryId { get; set; }

        public virtual Country Country { get; set; }
        public ICollection<Recommendation> Recommendations { get; set; }
    }

}
