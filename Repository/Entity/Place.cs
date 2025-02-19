using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Place
    {
        [Key]
        public int PlaceId { get; set; }
        public string PlaceName { get; set; }

        [ForeignKey("CategoryId")]
        public virtual int CategoryId { get; set; }

        public Category Category { get; set; }

        [ForeignKey("CityId")]
        public virtual int CityId { get; set; }

        public City City { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

}
