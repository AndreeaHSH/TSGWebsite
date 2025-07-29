using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/projects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProjects()
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.ResponsibleMember)
                    .Include(p => p.ExecutorMember)
                    .Include(p => p.BeginnerMember)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Description,
                        Status = p.Status.ToString(),
                        p.StartDate,
                        p.EndDate,
                        p.RepositoryUrl,
                        p.LiveUrl,
                        p.ResponsibleMemberId,
                        p.ExecutorMemberId,
                        p.BeginnerMemberId,
                        p.CreatedAt,
                        p.UpdatedAt,
                        ResponsibleMember = p.ResponsibleMember != null ? new
                        {
                            p.ResponsibleMember.Id,
                            p.ResponsibleMember.FirstName,
                            p.ResponsibleMember.LastName,
                            FullName = p.ResponsibleMember.FirstName + " " + p.ResponsibleMember.LastName,
                            Department = p.ResponsibleMember.Department.ToString()
                        } : null,
                        ExecutorMember = p.ExecutorMember != null ? new
                        {
                            p.ExecutorMember.Id,
                            p.ExecutorMember.FirstName,
                            p.ExecutorMember.LastName,
                            FullName = p.ExecutorMember.FirstName + " " + p.ExecutorMember.LastName,
                            Department = p.ExecutorMember.Department.ToString()
                        } : null,
                        BeginnerMember = p.BeginnerMember != null ? new
                        {
                            p.BeginnerMember.Id,
                            p.BeginnerMember.FirstName,
                            p.BeginnerMember.LastName,
                            FullName = p.BeginnerMember.FirstName + " " + p.BeginnerMember.LastName,
                            Department = p.BeginnerMember.Department.ToString()
                        } : null
                    })
                    .OrderByDescending(p => p.CreatedAt)
                    .ToListAsync();

                return Ok(projects);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProjects: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetProject(int id)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.ResponsibleMember)
                    .Include(p => p.ExecutorMember)
                    .Include(p => p.BeginnerMember)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (project == null)
                {
                    return NotFound();
                }

                var result = new
                {
                    project.Id,
                    project.Name,
                    project.Description,
                    Status = project.Status.ToString(),
                    project.StartDate,
                    project.EndDate,
                    project.RepositoryUrl,
                    project.LiveUrl,
                    project.ResponsibleMemberId,
                    project.ExecutorMemberId,
                    project.BeginnerMemberId,
                    project.CreatedAt,
                    project.UpdatedAt,
                    ResponsibleMember = project.ResponsibleMember != null ? new
                    {
                        project.ResponsibleMember.Id,
                        project.ResponsibleMember.FirstName,
                        project.ResponsibleMember.LastName,
                        FullName = project.ResponsibleMember.FirstName + " " + project.ResponsibleMember.LastName,
                        Department = project.ResponsibleMember.Department.ToString()
                    } : null,
                    ExecutorMember = project.ExecutorMember != null ? new
                    {
                        project.ExecutorMember.Id,
                        project.ExecutorMember.FirstName,
                        project.ExecutorMember.LastName,
                        FullName = project.ExecutorMember.FirstName + " " + project.ExecutorMember.LastName,
                        Department = project.ExecutorMember.Department.ToString()
                    } : null,
                    BeginnerMember = project.BeginnerMember != null ? new
                    {
                        project.BeginnerMember.Id,
                        project.BeginnerMember.FirstName,
                        project.BeginnerMember.LastName,
                        FullName = project.BeginnerMember.FirstName + " " + project.BeginnerMember.LastName,
                        Department = project.BeginnerMember.Department.ToString()
                    } : null
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetProject: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<object>> CreateProject(CreateProjectDto projectDto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(projectDto.Name))
                    return BadRequest("Project name is required");

                if (string.IsNullOrWhiteSpace(projectDto.Description))
                    return BadRequest("Project description is required");

                if (projectDto.ResponsibleMemberId <= 0)
                    return BadRequest("Responsible member is required");

                // Validate members exist
                if (!await _context.Members.AnyAsync(m => m.Id == projectDto.ResponsibleMemberId))
                {
                    return BadRequest("Responsible member not found");
                }

                if (projectDto.ExecutorMemberId.HasValue &&
                    !await _context.Members.AnyAsync(m => m.Id == projectDto.ExecutorMemberId))
                {
                    return BadRequest("Executor member not found");
                }

                if (projectDto.BeginnerMemberId.HasValue &&
                    !await _context.Members.AnyAsync(m => m.Id == projectDto.BeginnerMemberId))
                {
                    return BadRequest("Beginner member not found");
                }

                // Parse status
                if (!Enum.TryParse<ProjectStatus>(projectDto.Status, out var status))
                {
                    return BadRequest("Invalid project status");
                }

                var project = new Project
                {
                    Name = projectDto.Name,
                    Description = projectDto.Description,
                    Status = status,
                    StartDate = projectDto.StartDate,
                    EndDate = projectDto.EndDate,
                    RepositoryUrl = projectDto.RepositoryUrl,
                    LiveUrl = projectDto.LiveUrl,
                    ResponsibleMemberId = projectDto.ResponsibleMemberId,
                    ExecutorMemberId = projectDto.ExecutorMemberId,
                    BeginnerMemberId = projectDto.BeginnerMemberId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Projects.Add(project);
                await _context.SaveChangesAsync();

                // Return created project
                var result = new
                {
                    project.Id,
                    project.Name,
                    project.Description,
                    Status = project.Status.ToString(),
                    project.StartDate,
                    project.EndDate,
                    project.RepositoryUrl,
                    project.LiveUrl,
                    project.ResponsibleMemberId,
                    project.ExecutorMemberId,
                    project.BeginnerMemberId,
                    project.CreatedAt,
                    project.UpdatedAt
                };

                return CreatedAtAction(nameof(GetProject), new { id = project.Id }, result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateProject: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto projectDto)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return NotFound();
                }

                // Validate input
                if (string.IsNullOrWhiteSpace(projectDto.Name))
                    return BadRequest("Project name is required");

                if (string.IsNullOrWhiteSpace(projectDto.Description))
                    return BadRequest("Project description is required");

                if (projectDto.ResponsibleMemberId <= 0)
                    return BadRequest("Responsible member is required");

                // Validate members exist
                if (!await _context.Members.AnyAsync(m => m.Id == projectDto.ResponsibleMemberId))
                {
                    return BadRequest("Responsible member not found");
                }

                if (projectDto.ExecutorMemberId.HasValue &&
                    !await _context.Members.AnyAsync(m => m.Id == projectDto.ExecutorMemberId))
                {
                    return BadRequest("Executor member not found");
                }

                if (projectDto.BeginnerMemberId.HasValue &&
                    !await _context.Members.AnyAsync(m => m.Id == projectDto.BeginnerMemberId))
                {
                    return BadRequest("Beginner member not found");
                }

                // Parse status
                if (!Enum.TryParse<ProjectStatus>(projectDto.Status, out var status))
                {
                    return BadRequest("Invalid project status");
                }

                project.Name = projectDto.Name;
                project.Description = projectDto.Description;
                project.Status = status;
                project.StartDate = projectDto.StartDate;
                project.EndDate = projectDto.EndDate;
                project.RepositoryUrl = projectDto.RepositoryUrl;
                project.LiveUrl = projectDto.LiveUrl;
                project.ResponsibleMemberId = projectDto.ResponsibleMemberId;
                project.ExecutorMemberId = projectDto.ExecutorMemberId;
                project.BeginnerMemberId = projectDto.BeginnerMemberId;
                project.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateProject: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return NotFound();
                }

                // Check if project has reports
                var hasReports = await _context.Reports.AnyAsync(r => r.ProjectId == id);
                if (hasReports)
                {
                    return BadRequest("Cannot delete project with existing reports.");
                }

                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteProject: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    // DTOs
    public class CreateProjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Planning";
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? RepositoryUrl { get; set; }
        public string? LiveUrl { get; set; }
        public int ResponsibleMemberId { get; set; }
        public int? ExecutorMemberId { get; set; }
        public int? BeginnerMemberId { get; set; }
    }

    public class UpdateProjectDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Planning";
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? RepositoryUrl { get; set; }
        public string? LiveUrl { get; set; }
        public int ResponsibleMemberId { get; set; }
        public int? ExecutorMemberId { get; set; }
        public int? BeginnerMemberId { get; set; }
    }
}