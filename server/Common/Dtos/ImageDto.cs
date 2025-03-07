using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Common.Dtos
{
    public class ImageDto
    {
        public int ImageId { get; set; }
        public string? Url { get; set; } 
        public IFormFile? File { get; set; }
        public int RecommendationId { get; set; }
    }

}