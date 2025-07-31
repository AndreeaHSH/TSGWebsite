using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;

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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetMembers(
            [FromQuery] Department? department = null,
            [FromQuery] bool? isActive = null)
        {
            try
            {
                var query = _context.Members.AsQueryable();

                if (department.HasValue)
                    query = query.Where(m => m.Department == department.Value);

                if (isActive.HasValue)
                    query = query.Where(m => m.IsActive == isActive.Value);

                var rawMembers = await query.ToListAsync();

                var members = rawMembers.Select(m => new
                {
                    m.Id,
                    m.FirstName,
                    m.LastName,
                    FullName = m.FirstName + " " + m.LastName,
                    m.Email,
                    m.Phone,
                    Department = m.Department.ToString(),
                    Role = m.Role.ToString(),
                    m.IsActive,
                    m.JoinedAt,
                    m.LinkedInUrl,
                    m.GitHubUrl,
                    m.ImageUrl
                })
                .OrderBy(m => m.Department)
                .ThenBy(m => m.FirstName)
                .ToList();

                return Ok(members);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMembers: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-department")]
        public async Task<ActionResult<object>> GetMembersByDepartment([FromQuery] bool activeOnly = true)
        {
            try
            {
                var query = _context.Members.AsQueryable();

                if (activeOnly)
                {
                    query = query.Where(m => m.IsActive);
                }

                var rawMembers = await query.ToListAsync();

                var membersByDepartment = rawMembers
                    .GroupBy(m => m.Department)
                    .Select(g => new
                    {
                        Department = g.Key.ToString(),
                        DepartmentDisplayName = GetDepartmentDisplayName(g.Key),
                        Members = g.Select(m => new
                        {
                            m.Id,
                            m.FirstName,
                            m.LastName,
                            FullName = m.FirstName + " " + m.LastName,
                            m.Email,
                            m.Phone,
                            Department = m.Department.ToString(),
                            Role = m.Role.ToString(),
                            m.IsActive,
                            m.JoinedAt,
                            m.LinkedInUrl,
                            m.GitHubUrl,
                            m.ImageUrl
                        }).OrderBy(m => m.FirstName).ToList(),
                        MemberCount = g.Count()
                    })
                    .OrderBy(g => GetDepartmentOrder(g.Department))
                    .ToList();

                return Ok(membersByDepartment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMembersByDepartment: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetMember(int id)
        {
            try
            {
                var member = await _context.Members.FindAsync(id);
                if (member == null)
                {
                    return NotFound();
                }

                var result = new
                {
                    member.Id,
                    member.FirstName,
                    member.LastName,
                    FullName = member.FirstName + " " + member.LastName,
                    member.Email,
                    member.Phone,
                    Department = member.Department.ToString(),
                    Role = member.Role.ToString(),
                    member.IsActive,
                    member.JoinedAt,
                    member.LinkedInUrl,
                    member.GitHubUrl,
                    member.ImageUrl
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateMember(CreateMemberDto memberDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(memberDto.FirstName))
                    return BadRequest("First name is required");

                if (string.IsNullOrWhiteSpace(memberDto.LastName))
                    return BadRequest("Last name is required");

                if (string.IsNullOrWhiteSpace(memberDto.Email))
                    return BadRequest("Email is required");

                if (string.IsNullOrWhiteSpace(memberDto.Department))
                    return BadRequest("Department is required");

                if (string.IsNullOrWhiteSpace(memberDto.Role))
                    return BadRequest("Role is required");

                if (await _context.Members.AnyAsync(m => m.Email == memberDto.Email))
                {
                    return BadRequest("Email already exists");
                }

                if (!Enum.TryParse<Department>(memberDto.Department, true, out var department))
                {
                    return BadRequest($"Invalid department: {memberDto.Department}. Valid values: Frontend, Backend, Mobile, Communication, Networking, GraphicDesign, FullStack, Management");
                }

                if (!Enum.TryParse<MemberRole>(memberDto.Role, true, out var role))
                {
                    return BadRequest($"Invalid role: {memberDto.Role}. Valid values: Member, Lead, Coordinator, Founder");
                }

                var member = new Member
                {
                    FirstName = memberDto.FirstName,
                    LastName = memberDto.LastName,
                    Email = memberDto.Email,
                    Phone = memberDto.Phone,
                    Department = department,
                    Role = role,
                    IsActive = true,
                    JoinedAt = DateTime.UtcNow,
                    LinkedInUrl = memberDto.LinkedInUrl,
                    GitHubUrl = memberDto.GitHubUrl,
                    ImageUrl = memberDto.ImageUrl
                };

                _context.Members.Add(member);
                await _context.SaveChangesAsync();

                var result = new
                {
                    member.Id,
                    member.FirstName,
                    member.LastName,
                    FullName = member.FirstName + " " + member.LastName,
                    member.Email,
                    member.Phone,
                    Department = member.Department.ToString(),
                    Role = member.Role.ToString(),
                    member.IsActive,
                    member.JoinedAt,
                    member.LinkedInUrl,
                    member.GitHubUrl,
                    member.ImageUrl
                };

                return CreatedAtAction(nameof(GetMember), new { id = member.Id }, result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CreateMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, UpdateMemberDto memberDto)
        {
            try
            {
                var member = await _context.Members.FindAsync(id);
                if (member == null)
                {
                    return NotFound();
                }

                if (string.IsNullOrWhiteSpace(memberDto.FirstName))
                    return BadRequest("First name is required");

                if (string.IsNullOrWhiteSpace(memberDto.LastName))
                    return BadRequest("Last name is required");

                if (string.IsNullOrWhiteSpace(memberDto.Email))
                    return BadRequest("Email is required");

                if (string.IsNullOrWhiteSpace(memberDto.Department))
                    return BadRequest("Department is required");

                if (string.IsNullOrWhiteSpace(memberDto.Role))
                    return BadRequest("Role is required");

                if (await _context.Members.AnyAsync(m => m.Email == memberDto.Email && m.Id != id))
                {
                    return BadRequest("Email already exists");
                }

                if (!Enum.TryParse<Department>(memberDto.Department, true, out var department))
                {
                    return BadRequest($"Invalid department: {memberDto.Department}");
                }

                if (!Enum.TryParse<MemberRole>(memberDto.Role, true, out var role))
                {
                    return BadRequest($"Invalid role: {memberDto.Role}");
                }

                member.FirstName = memberDto.FirstName;
                member.LastName = memberDto.LastName;
                member.Email = memberDto.Email;
                member.Phone = memberDto.Phone;
                member.Department = department;
                member.Role = role;
                member.IsActive = memberDto.IsActive;
                member.LinkedInUrl = memberDto.LinkedInUrl;
                member.GitHubUrl = memberDto.GitHubUrl;
                member.ImageUrl = memberDto.ImageUrl;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}/deactivate")]
        public async Task<IActionResult> DeactivateMember(int id)
        {
            try
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeactivateMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}/activate")]
        public async Task<IActionResult> ActivateMember(int id)
        {
            try
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ActivateMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            try
            {
                var member = await _context.Members.FindAsync(id);
                if (member == null)
                {
                    return NotFound();
                }

                var hasReports = await _context.Reports.AnyAsync(r => r.MemberId == id);
                var hasProjects = await _context.Projects.AnyAsync(p =>
                    p.ResponsibleMemberId == id || p.ExecutorMemberId == id || p.BeginnerMemberId == id);

                if (hasReports || hasProjects)
                {
                    return BadRequest("Cannot delete member with existing reports or projects. Deactivate the member instead.");
                }

                _context.Members.Remove(member);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteMember: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

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

        private static int GetDepartmentOrder(string department)
        {
            return department switch
            {
                "Management" => 1,
                "Frontend" => 2,
                "Backend" => 3,
                "FullStack" => 4,
                "Mobile" => 5,
                "Communication" => 6,
                "Networking" => 7,
                "GraphicDesign" => 8,
                _ => 9
            };
        }
    }

    public class CreateMemberDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Department { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class UpdateMemberDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string Department { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? ImageUrl { get; set; }
    }
}