using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; }

        public string? Url { get; set; } // נתיב לתמונה

        [ForeignKey("RecoId")]
        public virtual int RecommendationId { get; set; }

        public virtual Recommendation Recommendation { get; set; }
    }


}
