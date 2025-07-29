using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using TSGwebsite.Models.DTOs;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reports
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReportDto>>> GetReports(
            [FromQuery] int? memberId = null,
            [FromQuery] int? projectId = null,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] Department? department = null)
        {
            var query = _context.Reports
                .Include(r => r.Member)
                .Include(r => r.Project)
                .AsQueryable();

            if (memberId.HasValue)
                query = query.Where(r => r.MemberId == memberId.Value);

            if (projectId.HasValue)
                query = query.Where(r => r.ProjectId == projectId.Value);

            if (month.HasValue)
                query = query.Where(r => r.Month == month.Value);

            if (year.HasValue)
                query = query.Where(r => r.Year == year.Value);

            if (department.HasValue)
                query = query.Where(r => r.Member.Department == department.Value);

            var reports = await query
                .OrderByDescending(r => r.Year)
                .ThenByDescending(r => r.Month)
                .ThenBy(r => r.Member.FirstName)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    MemberId = r.MemberId,
                    MemberName = r.Member.FullName,
                    MemberDepartment = r.Member.Department.ToString(),
                    ProjectId = r.ProjectId,
                    ProjectName = r.Project.Name,
                    Month = r.Month,
                    Year = r.Year,
                    WorkDescription = r.WorkDescription,
                    HoursWorked = r.HoursWorked,
                    Achievements = r.Achievements,
                    Challenges = r.Challenges,
                    NextMonthPlans = r.NextMonthPlans,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .ToListAsync();

            return Ok(reports);
        }

        // GET: api/reports/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ReportDto>> GetReport(int id)
        {
            var report = await _context.Reports
                .Include(r => r.Member)
                .Include(r => r.Project)
                .Where(r => r.Id == id)
                .Select(r => new ReportDto
                {
                    Id = r.Id,
                    MemberId = r.MemberId,
                    MemberName = r.Member.FullName,
                    MemberDepartment = r.Member.Department.ToString(),
                    ProjectId = r.ProjectId,
                    ProjectName = r.Project.Name,
                    Month = r.Month,
                    Year = r.Year,
                    WorkDescription = r.WorkDescription,
                    HoursWorked = r.HoursWorked,
                    Achievements = r.Achievements,
                    Challenges = r.Challenges,
                    NextMonthPlans = r.NextMonthPlans,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (report == null)
            {
                return NotFound();
            }

            return Ok(report);
        }

        // POST: api/reports
        [HttpPost]
public async Task<ActionResult<ReportDto>> CreateReport(CreateReportDto createReportDto)
{
    try
    {
        // Add logging to see what data we receive
        Console.WriteLine($"Received CreateReport request:");
        Console.WriteLine($"MemberId: {createReportDto.MemberId}");
        Console.WriteLine($"ProjectId: {createReportDto.ProjectId}");
        Console.WriteLine($"Month: {createReportDto.Month}");
        Console.WriteLine($"Year: {createReportDto.Year}");
        Console.WriteLine($"WorkDescription: {createReportDto.WorkDescription}");
        Console.WriteLine($"HoursWorked: {createReportDto.HoursWorked}");

        // Basic validation
        if (createReportDto.MemberId <= 0)
        {
            return BadRequest("Member ID must be greater than 0");
        }

        if (createReportDto.ProjectId <= 0)
        {
            return BadRequest("Project ID must be greater than 0");
        }

        if (string.IsNullOrWhiteSpace(createReportDto.WorkDescription))
        {
            return BadRequest("Work description is required");
        }

        if (createReportDto.HoursWorked <= 0)
        {
            return BadRequest("Hours worked must be greater than 0");
        }

        if (createReportDto.Month < 1 || createReportDto.Month > 12)
        {
            return BadRequest("Month must be between 1 and 12");
        }

        if (createReportDto.Year < 2020 || createReportDto.Year > 2030)
        {
            return BadRequest("Year must be between 2020 and 2030");
        }

        // Check if member exists (only if Members table exists)
        try
        {
            var member = await _context.Members.FindAsync(createReportDto.MemberId);
            if (member == null)
            {
                return BadRequest($"Member with ID {createReportDto.MemberId} not found");
            }
        }
        catch (Exception memberEx)
        {
            Console.WriteLine($"Member lookup failed: {memberEx.Message}");
            // Continue without member validation if table doesn't exist
        }

        // Check if project exists (only if Projects table exists)
        try
        {
            var project = await _context.Projects.FindAsync(createReportDto.ProjectId);
            if (project == null)
            {
                return BadRequest($"Project with ID {createReportDto.ProjectId} not found");
            }
        }
        catch (Exception projectEx)
        {
            Console.WriteLine($"Project lookup failed: {projectEx.Message}");
            // Continue without project validation if table doesn't exist
        }

        // Check if report already exists for this member, project, month, and year
        var existingReport = await _context.Reports
            .FirstOrDefaultAsync(r => r.MemberId == createReportDto.MemberId &&
                                     r.ProjectId == createReportDto.ProjectId &&
                                     r.Month == createReportDto.Month &&
                                     r.Year == createReportDto.Year);

        if (existingReport != null)
        {
            return BadRequest("Report already exists for this member, project, month, and year");
        }

        var report = new Report
        {
            MemberId = createReportDto.MemberId,
            ProjectId = createReportDto.ProjectId,
            Month = createReportDto.Month,
            Year = createReportDto.Year,
            WorkDescription = createReportDto.WorkDescription,
            HoursWorked = createReportDto.HoursWorked,
            Achievements = createReportDto.Achievements,
            Challenges = createReportDto.Challenges,
            NextMonthPlans = createReportDto.NextMonthPlans,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Reports.Add(report);
        await _context.SaveChangesAsync();

        Console.WriteLine($"Report created successfully with ID: {report.Id}");

        // Return a simplified response for now
        var createdReport = new ReportDto
        {
            Id = report.Id,
            MemberId = report.MemberId,
            MemberName = $"Member {report.MemberId}",
            MemberDepartment = "Unknown",
            ProjectId = report.ProjectId,
            ProjectName = $"Project {report.ProjectId}",
            Month = report.Month,
            Year = report.Year,
            WorkDescription = report.WorkDescription,
            HoursWorked = report.HoursWorked,
            Achievements = report.Achievements,
            Challenges = report.Challenges,
            NextMonthPlans = report.NextMonthPlans,
            CreatedAt = report.CreatedAt,
            UpdatedAt = report.UpdatedAt
        };

        return CreatedAtAction(nameof(GetReport), new { id = report.Id }, createdReport);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in CreateReport: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return StatusCode(500, $"Internal server error: {ex.Message}");
    }
}

        // PUT: api/reports/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReport(int id, UpdateReportDto updateReportDto)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            report.WorkDescription = updateReportDto.WorkDescription;
            report.HoursWorked = updateReportDto.HoursWorked;
            report.Achievements = updateReportDto.Achievements;
            report.Challenges = updateReportDto.Challenges;
            report.NextMonthPlans = updateReportDto.NextMonthPlans;
            report.UpdatedAt = DateTime.UtcNow;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/reports/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.Reports.FindAsync(id);
            if (report == null)
            {
                return NotFound();
            }

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/reports/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetReportStatistics(
            [FromQuery] int? year = null,
            [FromQuery] int? month = null)
        {
            var currentYear = year ?? DateTime.Now.Year;
            var currentMonth = month ?? DateTime.Now.Month;

            var query = _context.Reports
                .Include(r => r.Member)
                .Include(r => r.Project)
                .Where(r => r.Year == currentYear);

            if (month.HasValue)
            {
                query = query.Where(r => r.Month == currentMonth);
            }

            var totalReports = await query.CountAsync();
            var totalHours = await query.SumAsync(r => r.HoursWorked);
            var activeMembers = await query.Select(r => r.MemberId).Distinct().CountAsync();
            var activeProjects = await query.Select(r => r.ProjectId).Distinct().CountAsync();

            var departmentStats = await query
                .GroupBy(r => r.Member.Department)
                .Select(g => new
                {
                    Department = g.Key.ToString(),
                    ReportCount = g.Count(),
                    TotalHours = g.Sum(r => r.HoursWorked),
                    MemberCount = g.Select(r => r.MemberId).Distinct().Count()
                })
                .ToListAsync();

            var projectStats = await query
                .GroupBy(r => r.Project)
                .Select(g => new
                {
                    ProjectId = g.Key.Id,
                    ProjectName = g.Key.Name,
                    ReportCount = g.Count(),
                    TotalHours = g.Sum(r => r.HoursWorked),
                    ContributorCount = g.Select(r => r.MemberId).Distinct().Count()
                })
                .OrderByDescending(p => p.TotalHours)
                .ToListAsync();

            return Ok(new
            {
                Period = month.HasValue ? $"{currentMonth}/{currentYear}" : currentYear.ToString(),
                Summary = new
                {
                    TotalReports = totalReports,
                    TotalHours = totalHours,
                    ActiveMembers = activeMembers,
                    ActiveProjects = activeProjects
                },
                DepartmentStatistics = departmentStats,
                ProjectStatistics = projectStats
            });
        }

        private bool ReportExists(int id)
        {
            return _context.Reports.Any(e => e.Id == id);
        }
    }
}
