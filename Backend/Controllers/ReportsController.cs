using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using TSGwebsite.Models.DTOs;
using System.Text;
using OfficeOpenXml;
using OfficeOpenXml.Style;

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

        // *** NEW METHOD: Excel Export ***
        [HttpGet("export")]
        public async Task<IActionResult> ExportReports(
            [FromQuery] int? memberId = null,
            [FromQuery] int? projectId = null,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] Department? department = null,
            [FromQuery] string format = "excel")
        {
            try
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
                    .ToListAsync();

                if (format.ToLower() == "excel")
                {
                    return await ExportToExcel(reports);
                }
                else
                {
                    return ExportToCsv(reports);
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Error exporting reports: {ex.Message}");
            }
        }

        private async Task<IActionResult> ExportToExcel(List<Report> reports)
        {
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Rapoarte TSG");

            // Set up headers
            var headers = new[]
            {
                "Membru", "Departament", "Rol", "Proiect", "Luna", "Anul", 
                "Ore Lucrate", "Descriere Muncă", "Realizări", "Provocări", 
                "Planuri Luna Următoare", "Data Creare"
            };

            // Add headers to worksheet
            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cells[1, i + 1].Value = headers[i];
                worksheet.Cells[1, i + 1].Style.Font.Bold = true;
                worksheet.Cells[1, i + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                worksheet.Cells[1, i + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                worksheet.Cells[1, i + 1].Style.Border.BorderAround(ExcelBorderStyle.Thin);
            }

            // Add data rows
            for (int i = 0; i < reports.Count; i++)
            {
                var report = reports[i];
                int row = i + 2;

                worksheet.Cells[row, 1].Value = report.Member.FullName;
                worksheet.Cells[row, 2].Value = GetDepartmentDisplayName(report.Member.Department);
                worksheet.Cells[row, 3].Value = GetRoleDisplayName(report.Member.Role);
                worksheet.Cells[row, 4].Value = report.Project.Name;
                worksheet.Cells[row, 5].Value = GetMonthName(report.Month);
                worksheet.Cells[row, 6].Value = report.Year;
                worksheet.Cells[row, 7].Value = report.HoursWorked;
                worksheet.Cells[row, 8].Value = report.WorkDescription;
                worksheet.Cells[row, 9].Value = report.Achievements ?? "";
                worksheet.Cells[row, 10].Value = report.Challenges ?? "";
                worksheet.Cells[row, 11].Value = report.NextMonthPlans ?? "";
                worksheet.Cells[row, 12].Value = report.CreatedAt.ToString("dd/MM/yyyy HH:mm");

                // Add borders
                for (int col = 1; col <= headers.Length; col++)
                {
                    worksheet.Cells[row, col].Style.Border.BorderAround(ExcelBorderStyle.Thin);
                }
            }

            // Auto-fit columns
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Set specific column widths for better readability
            worksheet.Column(1).Width = 20; // Membru
            worksheet.Column(2).Width = 15; // Departament
            worksheet.Column(4).Width = 25; // Proiect
            worksheet.Column(8).Width = 50; // Descriere
            worksheet.Column(9).Width = 30; // Realizări
            worksheet.Column(10).Width = 30; // Provocări
            worksheet.Column(11).Width = 30; // Planuri

            // Add summary section
            int summaryStartRow = reports.Count + 4;
            
            worksheet.Cells[summaryStartRow, 1].Value = "SUMAR RAPOARTE";
            worksheet.Cells[summaryStartRow, 1].Style.Font.Bold = true;
            worksheet.Cells[summaryStartRow, 1].Style.Font.Size = 14;

            var totalHours = reports.Sum(r => r.HoursWorked);
            var uniqueMembers = reports.Select(r => r.MemberId).Distinct().Count();
            var uniqueProjects = reports.Select(r => r.ProjectId).Distinct().Count();

            worksheet.Cells[summaryStartRow + 2, 1].Value = "Total Rapoarte:";
            worksheet.Cells[summaryStartRow + 2, 2].Value = reports.Count;
            
            worksheet.Cells[summaryStartRow + 3, 1].Value = "Total Ore:";
            worksheet.Cells[summaryStartRow + 3, 2].Value = totalHours;
            
            worksheet.Cells[summaryStartRow + 4, 1].Value = "Membri Activi:";
            worksheet.Cells[summaryStartRow + 4, 2].Value = uniqueMembers;
            
            worksheet.Cells[summaryStartRow + 5, 1].Value = "Proiecte Active:";
            worksheet.Cells[summaryStartRow + 5, 2].Value = uniqueProjects;

            // Generate file
            var stream = new MemoryStream();
            await package.SaveAsAsync(stream);
            stream.Position = 0;

            var fileName = $"rapoarte_tsg_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            
            return File(stream, 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }

        private IActionResult ExportToCsv(List<Report> reports)
        {
            var csv = new StringBuilder();
            csv.AppendLine("Membru,Departament,Rol,Proiect,Luna,Anul,Ore Lucrate,Descriere Muncă");

            foreach (var report in reports)
            {
                csv.AppendLine($"\"{report.Member.FullName}\",\"{GetDepartmentDisplayName(report.Member.Department)}\",\"{GetRoleDisplayName(report.Member.Role)}\",\"{report.Project.Name}\",\"{GetMonthName(report.Month)}\",{report.Year},{report.HoursWorked},\"{report.WorkDescription}\"");
            }

            var fileName = $"rapoarte_tsg_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            
            return File(bytes, "text/csv", fileName);
        }

        // Helper methods for export
        private static string GetDepartmentDisplayName(Department department)
        {
            return department switch
            {
                Department.Frontend => "Front-end",
                Department.Backend => "Back-end",
                Department.Mobile => "Mobile",
                Department.Communication => "Comunicare",
                Department.Networking => "Networking",
                Department.GraphicDesign => "Graphic Design",
                Department.FullStack => "Full-stack",
                Department.Management => "Management",
                _ => department.ToString()
            };
        }

        private static string GetRoleDisplayName(MemberRole role)
        {
            return role switch
            {
                MemberRole.Member => "Membru",
                MemberRole.Lead => "Lead",
                MemberRole.Coordinator => "Coordonator",
                MemberRole.Founder => "Fondator",
                _ => role.ToString()
            };
        }

        private static string GetMonthName(int month)
        {
            return month switch
            {
                1 => "Ianuarie", 2 => "Februarie", 3 => "Martie", 4 => "Aprilie",
                5 => "Mai", 6 => "Iunie", 7 => "Iulie", 8 => "August",
                9 => "Septembrie", 10 => "Octombrie", 11 => "Noiembrie", 12 => "Decembrie",
                _ => month.ToString()
            };
        }

        private bool ReportExists(int id)
        {
            return _context.Reports.Any(e => e.Id == id);
        }
    }
}