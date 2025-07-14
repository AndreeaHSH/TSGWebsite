 
using System.ComponentModel.DataAnnotations;

namespace TSGwebsite.Models
{
    public class BlogPost
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(250)]
        public string Slug { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Summary { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? FeaturedImage { get; set; }
        
        public bool IsPublished { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? PublishedAt { get; set; }
        
        [StringLength(500)]
        public string Tags { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Author { get; set; } = string.Empty;
        
        public int ViewCount { get; set; } = 0;
    }
}