using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using TSGwebsite.Models.DTOs;

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
        public async Task<ActionResult<IEnumerable<ProjectDto>>> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.ResponsibleMember)
                .Include(p => p.ExecutorMember)
                .Include(p => p.BeginnerMember)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status.ToString(),
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    RepositoryUrl = p.RepositoryUrl,
                    LiveUrl = p.LiveUrl,
                    ResponsibleMemberId = p.ResponsibleMemberId,
                    ResponsibleMemberName = p.ResponsibleMember.FullName,
                    ExecutorMemberId = p.ExecutorMemberId,
                    ExecutorMemberName = p.ExecutorMember != null ? p.ExecutorMember.FullName : null,
                    BeginnerMemberId = p.BeginnerMemberId,
                    BeginnerMemberName = p.BeginnerMember != null ? p.BeginnerMember.FullName : null,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(projects);
        }

        // GET: api/projects/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectDto>> GetProject(int id)
        {
            var project = await _context.Projects
                .Include(p => p.ResponsibleMember)
                .Include(p => p.ExecutorMember)
                .Include(p => p.BeginnerMember)
                .Where(p => p.Id == id)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status.ToString(),
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    RepositoryUrl = p.RepositoryUrl,
                    LiveUrl = p.LiveUrl,
                    ResponsibleMemberId = p.ResponsibleMemberId,
                    ResponsibleMemberName = p.ResponsibleMember.FullName,
                    ExecutorMemberId = p.ExecutorMemberId,
                    ExecutorMemberName = p.ExecutorMember != null ? p.ExecutorMember.FullName : null,
                    BeginnerMemberId = p.BeginnerMemberId,
                    BeginnerMemberName = p.BeginnerMember != null ? p.BeginnerMember.FullName : null,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound();
            }

            return Ok(project);
        }

        // POST: api/projects
        [HttpPost]
        public async Task<ActionResult<ProjectDto>> CreateProject(CreateProjectDto createProjectDto)
        {
            var project = new Project
            {
                Name = createProjectDto.Name,
                Description = createProjectDto.Description,
                Status = createProjectDto.Status,
                StartDate = createProjectDto.StartDate,
                EndDate = createProjectDto.EndDate,
                RepositoryUrl = createProjectDto.RepositoryUrl,
                LiveUrl = createProjectDto.LiveUrl,
                ResponsibleMemberId = createProjectDto.ResponsibleMemberId,
                ExecutorMemberId = createProjectDto.ExecutorMemberId,
                BeginnerMemberId = createProjectDto.BeginnerMemberId
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            var createdProject = await _context.Projects
                .Include(p => p.ResponsibleMember)
                .Include(p => p.ExecutorMember)
                .Include(p => p.BeginnerMember)
                .Where(p => p.Id == project.Id)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Status = p.Status.ToString(),
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    RepositoryUrl = p.RepositoryUrl,
                    LiveUrl = p.LiveUrl,
                    ResponsibleMemberId = p.ResponsibleMemberId,
                    ResponsibleMemberName = p.ResponsibleMember.FullName,
                    ExecutorMemberId = p.ExecutorMemberId,
                    ExecutorMemberName = p.ExecutorMember != null ? p.ExecutorMember.FullName : null,
                    BeginnerMemberId = p.BeginnerMemberId,
                    BeginnerMemberName = p.BeginnerMember != null ? p.BeginnerMember.FullName : null,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt
                })
                .FirstAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, createdProject);
        }

        // PUT: api/projects/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, UpdateProjectDto updateProjectDto)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            project.Name = updateProjectDto.Name;
            project.Description = updateProjectDto.Description;
            project.Status = updateProjectDto.Status;
            project.StartDate = updateProjectDto.StartDate;
            project.EndDate = updateProjectDto.EndDate;
            project.RepositoryUrl = updateProjectDto.RepositoryUrl;
            project.LiveUrl = updateProjectDto.LiveUrl;
            project.ResponsibleMemberId = updateProjectDto.ResponsibleMemberId;
            project.ExecutorMemberId = updateProjectDto.ExecutorMemberId;
            project.BeginnerMemberId = updateProjectDto.BeginnerMemberId;
            project.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProjectExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/projects/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProjectExists(int id)
        {
            return _context.Projects.Any(e => e.Id == id);
        }
    }
}