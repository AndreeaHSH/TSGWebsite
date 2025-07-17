// Controllers/MembersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using TSGwebsite.Models.DTOs;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/members
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetMembers(
            [FromQuery] Department? department = null,
            [FromQuery] bool? isActive = null)
        {
            var query = _context.Members.AsQueryable();

            if (department.HasValue)
                query = query.Where(m => m.Department == department.Value);

            if (isActive.HasValue)
                query = query.Where(m => m.IsActive == isActive.Value);

            var members = await query
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Phone = m.Phone,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    IsActive = m.IsActive,
                    JoinedAt = m.JoinedAt,
                    LinkedInUrl = m.LinkedInUrl,
                    GitHubUrl = m.GitHubUrl,
                    ImageUrl = m.ImageUrl
                })
                .OrderBy(m => m.Department)
                .ThenBy(m => m.FirstName)
                .ToListAsync();

            return Ok(members);
        }

        // GET: api/members/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetMember(int id)
        {
            var member = await _context.Members
                .Where(m => m.Id == id)
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Phone = m.Phone,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    IsActive = m.IsActive,
                    JoinedAt = m.JoinedAt,
                    LinkedInUrl = m.LinkedInUrl,
                    GitHubUrl = m.GitHubUrl,
                    ImageUrl = m.ImageUrl
                })
                .FirstOrDefaultAsync();

            if (member == null)
            {
                return NotFound();
            }

            return Ok(member);
        }

        // POST: api/members
        [HttpPost]
        public async Task<ActionResult<MemberDto>> CreateMember(CreateMemberDto createMemberDto)
        {
            // Check if email already exists
            var existingMember = await _context.Members
                .FirstOrDefaultAsync(m => m.Email == createMemberDto.Email);
            
            if (existingMember != null)
            {
                return BadRequest("A member with this email already exists");
            }

            var member = new Member
            {
                FirstName = createMemberDto.FirstName,
                LastName = createMemberDto.LastName,
                Email = createMemberDto.Email,
                Phone = createMemberDto.Phone,
                Department = createMemberDto.Department,
                Role = createMemberDto.Role,
                LinkedInUrl = createMemberDto.LinkedInUrl,
                GitHubUrl = createMemberDto.GitHubUrl,
                ImageUrl = createMemberDto.ImageUrl,
                IsActive = true,
                JoinedAt = DateTime.UtcNow
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            var createdMember = new MemberDto
            {
                Id = member.Id,
                FirstName = member.FirstName,
                LastName = member.LastName,
                FullName = member.FullName,
                Email = member.Email,
                Phone = member.Phone,
                Department = member.Department.ToString(),
                Role = member.Role.ToString(),
                IsActive = member.IsActive,
                JoinedAt = member.JoinedAt,
                LinkedInUrl = member.LinkedInUrl,
                GitHubUrl = member.GitHubUrl,
                ImageUrl = member.ImageUrl
            };

            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, createdMember);
        }

        // PUT: api/members/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, UpdateMemberDto updateMemberDto)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            // Check if email is being changed and if new email already exists
            if (member.Email != updateMemberDto.Email)
            {
                var existingMember = await _context.Members
                    .FirstOrDefaultAsync(m => m.Email == updateMemberDto.Email && m.Id != id);
                
                if (existingMember != null)
                {
                    return BadRequest("A member with this email already exists");
                }
            }

            member.FirstName = updateMemberDto.FirstName;
            member.LastName = updateMemberDto.LastName;
            member.Email = updateMemberDto.Email;
            member.Phone = updateMemberDto.Phone;
            member.Department = updateMemberDto.Department;
            member.Role = updateMemberDto.Role;
            member.IsActive = updateMemberDto.IsActive;
            member.LinkedInUrl = updateMemberDto.LinkedInUrl;
            member.GitHubUrl = updateMemberDto.GitHubUrl;
            member.ImageUrl = updateMemberDto.ImageUrl;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MemberExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/members/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            // Check if member has reports or is assigned to projects
            var hasReports = await _context.Reports.AnyAsync(r => r.MemberId == id);
            var hasProjects = await _context.Projects.AnyAsync(p => 
                p.ResponsibleMemberId == id || 
                p.ExecutorMemberId == id || 
                p.BeginnerMemberId == id);

            if (hasReports || hasProjects)
            {
                // Soft delete - just deactivate the member
                member.IsActive = false;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Member deactivated successfully" });
            }
            else
            {
                // Hard delete if no dependencies
                _context.Members.Remove(member);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Member deleted successfully" });
            }
        }

        // GET: api/members/by-department
        [HttpGet("by-department")]
        public async Task<ActionResult<object>> GetMembersByDepartment()
        {
            var membersByDepartment = await _context.Members
                .Where(m => m.IsActive)
                .GroupBy(m => m.Department)
                .Select(g => new
                {
                    Department = g.Key.ToString(),
                    DepartmentDisplayName = GetDepartmentDisplayName(g.Key),
                    Members = g.Select(m => new MemberDto
                    {
                        Id = m.Id,
                        FirstName = m.FirstName,
                        LastName = m.LastName,
                        FullName = m.FullName,
                        Email = m.Email,
                        Phone = m.Phone,
                        Department = m.Department.ToString(),
                        Role = m.Role.ToString(),
                        IsActive = m.IsActive,
                        JoinedAt = m.JoinedAt,
                        LinkedInUrl = m.LinkedInUrl,
                        GitHubUrl = m.GitHubUrl,
                        ImageUrl = m.ImageUrl
                    }).OrderBy(m => m.FirstName).ToList(),
                    MemberCount = g.Count()
                })
                .OrderBy(g => g.Department)
                .ToListAsync();

            return Ok(membersByDepartment);
        }

        // GET: api/members/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetMemberStatistics()
        {
            var totalMembers = await _context.Members.CountAsync(m => m.IsActive);
            var totalInactiveMembers = await _context.Members.CountAsync(m => !m.IsActive);
            
            var departmentStats = await _context.Members
                .Where(m => m.IsActive)
                .GroupBy(m => m.Department)
                .Select(g => new
                {
                    Department = g.Key.ToString(),
                    DepartmentDisplayName = GetDepartmentDisplayName(g.Key),
                    Count = g.Count(),
                    Percentage = Math.Round((double)g.Count() / totalMembers * 100, 1)
                })
                .OrderByDescending(d => d.Count)
                .ToListAsync();

            var roleStats = await _context.Members
                .Where(m => m.IsActive)
                .GroupBy(m => m.Role)
                .Select(g => new
                {
                    Role = g.Key.ToString(),
                    RoleDisplayName = GetRoleDisplayName(g.Key),
                    Count = g.Count(),
                    Percentage = Math.Round((double)g.Count() / totalMembers * 100, 1)
                })
                .OrderByDescending(r => r.Count)
                .ToListAsync();

            var recentJoins = await _context.Members
                .Where(m => m.IsActive && m.JoinedAt >= DateTime.UtcNow.AddMonths(-3))
                .OrderByDescending(m => m.JoinedAt)
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    JoinedAt = m.JoinedAt,
                    ImageUrl = m.ImageUrl
                })
                .Take(10)
                .ToListAsync();

            return Ok(new
            {
                TotalActiveMembers = totalMembers,
                TotalInactiveMembers = totalInactiveMembers,
                DepartmentStatistics = departmentStats,
                RoleStatistics = roleStats,
                RecentJoins = recentJoins
            });
        }

        // GET: api/members/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> SearchMembers(
            [FromQuery] string? query = null,
            [FromQuery] Department? department = null,
            [FromQuery] MemberRole? role = null,
            [FromQuery] bool? isActive = true)
        {
            var membersQuery = _context.Members.AsQueryable();

            if (isActive.HasValue)
                membersQuery = membersQuery.Where(m => m.IsActive == isActive.Value);

            if (department.HasValue)
                membersQuery = membersQuery.Where(m => m.Department == department.Value);

            if (role.HasValue)
                membersQuery = membersQuery.Where(m => m.Role == role.Value);

            if (!string.IsNullOrWhiteSpace(query))
            {
                var searchQuery = query.ToLower().Trim();
                membersQuery = membersQuery.Where(m => 
                    m.FirstName.ToLower().Contains(searchQuery) ||
                    m.LastName.ToLower().Contains(searchQuery) ||
                    m.Email.ToLower().Contains(searchQuery));
            }

            var members = await membersQuery
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Phone = m.Phone,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    IsActive = m.IsActive,
                    JoinedAt = m.JoinedAt,
                    LinkedInUrl = m.LinkedInUrl,
                    GitHubUrl = m.GitHubUrl,
                    ImageUrl = m.ImageUrl
                })
                .OrderBy(m => m.FirstName)
                .ThenBy(m => m.LastName)
                .ToListAsync();

            return Ok(members);
        }

        // PUT: api/members/{id}/activate
        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            member.IsActive = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Member activated successfully" });
        }

        // PUT: api/members/{id}/deactivate
        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null)
            {
                return NotFound();
            }

            member.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Member deactivated successfully" });
        }

        // GET: api/members/leads
        [HttpGet("leads")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetLeads()
        {
            var leads = await _context.Members
                .Where(m => m.IsActive && (m.Role == MemberRole.Lead || m.Role == MemberRole.Coordinator || m.Role == MemberRole.Founder))
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    IsActive = m.IsActive,
                    JoinedAt = m.JoinedAt,
                    ImageUrl = m.ImageUrl
                })
                .OrderBy(m => m.Department)
                .ThenBy(m => m.FirstName)
                .ToListAsync();

            return Ok(leads);
        }

        // GET: api/members/available-for-projects
        [HttpGet("available-for-projects")]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetAvailableMembers()
        {
            var availableMembers = await _context.Members
                .Where(m => m.IsActive)
                .Select(m => new MemberDto
                {
                    Id = m.Id,
                    FirstName = m.FirstName,
                    LastName = m.LastName,
                    FullName = m.FullName,
                    Email = m.Email,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    IsActive = m.IsActive,
                    JoinedAt = m.JoinedAt,
                    ImageUrl = m.ImageUrl
                })
                .OrderBy(m => m.Department)
                .ThenBy(m => m.FirstName)
                .ToListAsync();

            return Ok(availableMembers);
        }

        private bool MemberExists(int id)
        {
            return _context.Members.Any(e => e.Id == id);
        }

        private static string GetDepartmentDisplayName(Department department)
        {
            return department switch
            {
                Department.Frontend => "Frontend",
                Department.Backend => "Backend",
                Department.Mobile => "Mobile",
                Department.Communication => "Communication",
                Department.Networking => "Networking",
                Department.GraphicDesign => "Graphic Design",
                Department.FullStack => "Full Stack",
                Department.Management => "Management",
                _ => department.ToString()
            };
        }

        private static string GetRoleDisplayName(MemberRole role)
        {
            return role switch
            {
                MemberRole.Member => "Member",
                MemberRole.Lead => "Lead",
                MemberRole.Coordinator => "Coordinator",
                MemberRole.Founder => "Founder",
                _ => role.ToString()
            };
        }
    }
}