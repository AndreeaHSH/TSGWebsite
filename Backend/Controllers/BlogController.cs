// Backend/Controllers/BlogController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using System.Text.Json;
using System.ComponentModel.DataAnnotations;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<BlogController> _logger;
        private readonly IWebHostEnvironment _environment;

        public BlogController(
            ApplicationDbContext context, 
            ILogger<BlogController> logger,
            IWebHostEnvironment environment)
        {
            _context = context;
            _logger = logger;
            _environment = environment;
        }

        // GET: api/blog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPostListDto>>> GetBlogPosts(
            [FromQuery] string? search = null,
            [FromQuery] string? status = null,
            [FromQuery] string? sortBy = "createdAt",
            [FromQuery] string? sortOrder = "desc")
        {
            try
            {
                var query = _context.BlogPosts.AsQueryable();

                // Search filter
                if (!string.IsNullOrEmpty(search))
                {
                    var searchTerm = search.ToLower();
                    query = query.Where(b => 
                        b.Title.ToLower().Contains(searchTerm) ||
                        b.Summary.ToLower().Contains(searchTerm) ||
                        b.Tags.ToLower().Contains(searchTerm) ||
                        b.Author.ToLower().Contains(searchTerm));
                }

                // Status filter
                if (!string.IsNullOrEmpty(status))
                {
                    if (status.ToLower() == "published")
                        query = query.Where(b => b.IsPublished);
                    else if (status.ToLower() == "draft")
                        query = query.Where(b => !b.IsPublished);
                }

                // Sorting
                query = sortBy?.ToLower() switch
                {
                    "title" => sortOrder?.ToLower() == "asc" 
                        ? query.OrderBy(b => b.Title) 
                        : query.OrderByDescending(b => b.Title),
                    "publishedat" => sortOrder?.ToLower() == "asc" 
                        ? query.OrderBy(b => b.PublishedAt ?? DateTime.MinValue) 
                        : query.OrderByDescending(b => b.PublishedAt ?? DateTime.MinValue),
                    "viewcount" => sortOrder?.ToLower() == "asc" 
                        ? query.OrderBy(b => b.ViewCount) 
                        : query.OrderByDescending(b => b.ViewCount),
                    _ => sortOrder?.ToLower() == "asc" 
                        ? query.OrderBy(b => b.CreatedAt) 
                        : query.OrderByDescending(b => b.CreatedAt)
                };

                var blogPosts = await query.Select(b => new BlogPostListDto
                {
                    Id = b.Id,
                    Title = b.Title,
                    Slug = b.Slug,
                    Summary = b.Summary,
                    FeaturedImage = b.FeaturedImage,
                    IsPublished = b.IsPublished,
                    CreatedAt = b.CreatedAt,
                    PublishedAt = b.PublishedAt,
                    Tags = b.Tags,
                    Author = b.Author,
                    ViewCount = b.ViewCount,
                    ReadingTime = CalculateReadingTime(b.Content),
                    ImageCount = GetImageCount(b.FeaturedImage, b.Tags) // Using Tags field temporarily for additional images
                }).ToListAsync();

                return Ok(blogPosts);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching blog posts");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/blog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<BlogPostDetailDto>> GetBlogPost(int id)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);

                if (blogPost == null)
                {
                    return NotFound($"Blog post with ID {id} not found");
                }

                var blogPostDetail = new BlogPostDetailDto
                {
                    Id = blogPost.Id,
                    Title = blogPost.Title,
                    Slug = blogPost.Slug,
                    Content = blogPost.Content,
                    Summary = blogPost.Summary,
                    FeaturedImage = blogPost.FeaturedImage,
                    IsPublished = blogPost.IsPublished,
                    CreatedAt = blogPost.CreatedAt,
                    PublishedAt = blogPost.PublishedAt,
                    Tags = blogPost.Tags,
                    Author = blogPost.Author,
                    ViewCount = blogPost.ViewCount,
                    ReadingTime = CalculateReadingTime(blogPost.Content),
                    BlogImages = GetBlogImages(blogPost.FeaturedImage, blogPost.Tags) // Temporary implementation
                };

                return Ok(blogPostDetail);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching blog post with ID {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/blog
        [HttpPost]
        public async Task<ActionResult<BlogPost>> CreateBlogPost([FromForm] BlogPostCreateDto createDto)
        {
            try
            {
                // Validate required fields
                if (string.IsNullOrEmpty(createDto.Title) || string.IsNullOrEmpty(createDto.Content))
                {
                    return BadRequest("Title and Content are required");
                }

                // Generate slug if not provided
                var slug = string.IsNullOrEmpty(createDto.Slug) 
                    ? GenerateSlug(createDto.Title) 
                    : createDto.Slug;

                // Check for duplicate slug
                if (await _context.BlogPosts.AnyAsync(b => b.Slug == slug))
                {
                    return BadRequest("A blog post with this slug already exists");
                }

                var blogPost = new BlogPost
                {
                    Title = createDto.Title,
                    Slug = slug,
                    Content = createDto.Content,
                    Summary = createDto.Summary ?? "",
                    Author = createDto.Author ?? "TSG Admin",
                    Tags = createDto.Tags ?? "",
                    IsPublished = createDto.IsPublished,
                    CreatedAt = DateTime.UtcNow,
                    PublishedAt = createDto.IsPublished ? DateTime.UtcNow : null
                };

                // Handle featured image upload
                if (createDto.FeaturedImageFile != null)
                {
                    var imageUrl = await SaveImageAsync(createDto.FeaturedImageFile, "featured");
                    blogPost.FeaturedImage = imageUrl;
                }

                _context.BlogPosts.Add(blogPost);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Created new blog post with ID {Id}", blogPost.Id);
                return CreatedAtAction(nameof(GetBlogPost), new { id = blogPost.Id }, blogPost);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating blog post");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/blog/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlogPost(int id, [FromForm] BlogPostUpdateDto updateDto)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);
                if (blogPost == null)
                {
                    return NotFound($"Blog post with ID {id} not found");
                }

                // Update fields
                blogPost.Title = updateDto.Title ?? blogPost.Title;
                blogPost.Content = updateDto.Content ?? blogPost.Content;
                blogPost.Summary = updateDto.Summary ?? blogPost.Summary;
                blogPost.Author = updateDto.Author ?? blogPost.Author;
                blogPost.Tags = updateDto.Tags ?? blogPost.Tags;

                // Handle slug update
                if (!string.IsNullOrEmpty(updateDto.Slug) && updateDto.Slug != blogPost.Slug)
                {
                    if (await _context.BlogPosts.AnyAsync(b => b.Slug == updateDto.Slug && b.Id != id))
                    {
                        return BadRequest("A blog post with this slug already exists");
                    }
                    blogPost.Slug = updateDto.Slug;
                }

                // Handle publish status change
                if (updateDto.IsPublished.HasValue)
                {
                    blogPost.IsPublished = updateDto.IsPublished.Value;
                    if (updateDto.IsPublished.Value && blogPost.PublishedAt == null)
                    {
                        blogPost.PublishedAt = DateTime.UtcNow;
                    }
                    else if (!updateDto.IsPublished.Value)
                    {
                        blogPost.PublishedAt = null;
                    }
                }

                // Handle featured image update
                if (updateDto.FeaturedImageFile != null)
                {
                    // Delete old image if exists
                    if (!string.IsNullOrEmpty(blogPost.FeaturedImage))
                    {
                        await DeleteImageAsync(blogPost.FeaturedImage);
                    }
                    
                    var imageUrl = await SaveImageAsync(updateDto.FeaturedImageFile, "featured");
                    blogPost.FeaturedImage = imageUrl;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation("Updated blog post with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating blog post with ID {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/blog/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);
                if (blogPost == null)
                {
                    return NotFound($"Blog post with ID {id} not found");
                }

                // Delete associated images
                if (!string.IsNullOrEmpty(blogPost.FeaturedImage))
                {
                    await DeleteImageAsync(blogPost.FeaturedImage);
                }

                _context.BlogPosts.Remove(blogPost);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Deleted blog post with ID {Id}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting blog post with ID {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/blog/{id}/publish
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> TogglePublishStatus(int id)
        {
            try
            {
                var blogPost = await _context.BlogPosts.FindAsync(id);
                if (blogPost == null)
                {
                    return NotFound($"Blog post with ID {id} not found");
                }

                blogPost.IsPublished = !blogPost.IsPublished;
                blogPost.PublishedAt = blogPost.IsPublished ? DateTime.UtcNow : null;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Toggled publish status for blog post with ID {Id} to {Status}", 
                    id, blogPost.IsPublished ? "Published" : "Draft");

                return Ok(new { isPublished = blogPost.IsPublished, publishedAt = blogPost.PublishedAt });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling publish status for blog post with ID {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // Helper Methods
        private static int CalculateReadingTime(string content)
        {
            const int wordsPerMinute = 200;
            var wordCount = content?.Split(new char[] { ' ', '\t', '\n', '\r' }, 
                StringSplitOptions.RemoveEmptyEntries).Length ?? 0;
            return Math.Max(1, (int)Math.Ceiling((double)wordCount / wordsPerMinute));
        }

        private static string GenerateSlug(string title)
        {
            var slug = title.ToLower()
                .Replace(" ", "-")
                .Replace("ă", "a").Replace("â", "a").Replace("î", "i")
                .Replace("ș", "s").Replace("ț", "t");
            
            // Remove non-alphanumeric characters except hyphens
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
            
            // Replace multiple hyphens with single hyphen
            slug = System.Text.RegularExpressions.Regex.Replace(slug, @"-+", "-");
            
            // Remove leading and trailing hyphens
            return slug.Trim('-');
        }

        private async Task<string> SaveImageAsync(IFormFile imageFile, string prefix)
        {
            try
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "blog");
                Directory.CreateDirectory(uploadsFolder);

                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmss");
                var fileName = $"{prefix}_{timestamp}_{Path.GetFileName(imageFile.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                return $"/uploads/blog/{fileName}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving image file");
                throw;
            }
        }

        private async Task DeleteImageAsync(string imageUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(imageUrl)) return;

                var fileName = Path.GetFileName(imageUrl);
                var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", "blog", fileName);

                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error deleting image file: {ImageUrl}", imageUrl);
            }
        }

        private static int GetImageCount(string? featuredImage, string? tags)
        {
            // Temporary implementation - will be replaced with proper image relationship
            return string.IsNullOrEmpty(featuredImage) ? 0 : 1;
        }

        private static List<string> GetBlogImages(string? featuredImage, string? tags)
        {
            // Temporary implementation - will be replaced with proper image relationship
            var images = new List<string>();
            if (!string.IsNullOrEmpty(featuredImage))
            {
                images.Add(featuredImage);
            }
            return images;
        }
    }

    // DTOs for the Blog API
    public class BlogPostListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string? FeaturedImage { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public string Tags { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public int ReadingTime { get; set; } // in minutes
        public int ImageCount { get; set; } // number of images in post
    }

    public class BlogPostDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string? FeaturedImage { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? PublishedAt { get; set; }
        public string Tags { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public int ViewCount { get; set; }
        public int ReadingTime { get; set; } // in minutes
        public List<string> BlogImages { get; set; } = new(); // All images including featured
    }

    public class BlogPostCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Slug { get; set; } // Auto-generated if not provided

        [Required]
        public string Content { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Summary { get; set; }

        [StringLength(100)]
        public string? Author { get; set; } // Defaults to "TSG Admin"

        [StringLength(500)]
        public string? Tags { get; set; } // Comma-separated tags

        public bool IsPublished { get; set; } = false;

        // File upload for featured image
        public IFormFile? FeaturedImageFile { get; set; }

        // Additional blog images (max 5)
        public List<IFormFile>? BlogImageFiles { get; set; }

        // Alt texts for images (corresponding to BlogImageFiles)
        public List<string>? ImageAltTexts { get; set; }
    }

    public class BlogPostUpdateDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(250)]
        public string? Slug { get; set; }

        public string? Content { get; set; }

        [StringLength(500)]
        public string? Summary { get; set; }

        [StringLength(100)]
        public string? Author { get; set; }

        [StringLength(500)]
        public string? Tags { get; set; }

        public bool? IsPublished { get; set; }

        // File upload for featured image
        public IFormFile? FeaturedImageFile { get; set; }

        // Additional blog images (max 5)
        public List<IFormFile>? BlogImageFiles { get; set; }

        // Alt texts for images
        public List<string>? ImageAltTexts { get; set; }

        // IDs of images to delete
        public List<int>? ImageIdsToDelete { get; set; }
    }

    public class ImageUploadResponseDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string AltText { get; set; } = string.Empty;
        public int Order { get; set; }
        public bool IsPrimary { get; set; }
    }

    public class BlogStatsDto
    {
        public int TotalPosts { get; set; }
        public int PublishedPosts { get; set; }
        public int DraftPosts { get; set; }
        public int TotalViews { get; set; }
        public int PostsThisMonth { get; set; }
        public double AverageReadingTime { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class TagDto
    {
        public string Name { get; set; } = string.Empty;
        public int PostCount { get; set; }
    }
}