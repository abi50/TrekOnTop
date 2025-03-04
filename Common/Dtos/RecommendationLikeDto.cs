using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Dtos
{
    
        public class RecommendationLikeDto
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public int RecoId { get; set; }
            public bool IsLike { get; set; } // true = לייק, false = דיסלייק
        }
}
