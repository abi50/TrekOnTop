using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dtos
{
    public class PlaceDto
    {
        public int PlaceId { get; set; }
        public string PlaceName { get; set; }
        public int CategoryId { get; set; }
        public int CityId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
