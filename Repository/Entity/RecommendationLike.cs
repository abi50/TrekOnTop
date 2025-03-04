using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class RecommendationLike
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        [ForeignKey("Recommendation")]
        public int RecoId { get; set; }
        public virtual Recommendation Recommendation { get; set; }

        public bool IsLike { get; set; } // true = לייק, false = דיסלייק
    }
}
