using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Entity
{
    public class Recommendation
    {
        [Key]
        public int RecoId { get; set; }

        [ForeignKey("UserId")]
        public int UserId { get; set; }

        public virtual User User { get; set; }

        [ForeignKey("PlaceId")]
        public int PlaceId { get; set; }
        public virtual Place Place { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        public int Likes { get; set; } = 0;
        public int Dislikes { get; set; } = 0;
        public virtual ICollection<RecommendationLike> RecommendationLikes { get; set; }

    }


}
