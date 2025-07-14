 using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VolunteersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<VolunteersController> _logger;

        public VolunteersController(ApplicationDbContext context, ILogger<VolunteersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Volunteer>>> GetVolunteers()
        {
            return await _context.Volunteers.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Volunteer>> CreateVolunteer([FromForm] VolunteerApplicationDto application, [FromForm] IFormFile? cvFile)
        {
            try
            {
                var volunteer = new Volunteer
                {
                    FirstName = application.FirstName,
                    LastName = application.LastName,
                    Email = application.Email,
                    Phone = application.Phone,
                    BirthDate = application.BirthDate,
                    Faculty = application.Faculty,
                    Specialization = application.Specialization,
                    StudyYear = application.StudyYear,
                    StudentId = application.StudentId,
                    PreferredRole = application.PreferredRole,
                    AlternativeRole = application.AlternativeRole,
                    ProgrammingLanguages = application.ProgrammingLanguages,
                    Frameworks = application.Frameworks,
                    Tools = application.Tools,
                    Experience = application.Experience,
                    Motivation = application.Motivation,
                    Contribution = application.Contribution,
                    TimeCommitment = application.TimeCommitment,
                    Schedule = application.Schedule,
                    PortfolioUrl = application.PortfolioUrl,
                    DataProcessingAgreement = application.DataProcessingAgreement,
                    TermsAgreement = application.TermsAgreement,
                    Status = VolunteerStatus.Pending,
                    SubmittedAt = DateTime.UtcNow
                };

                // Handle CV file if uploaded
                if (cvFile != null && cvFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "cvs");
                    Directory.CreateDirectory(uploadsFolder);
                    
                    var fileName = $"cv_{DateTime.Now:yyyyMMdd_HHmmss}_{Path.GetExtension(cvFile.FileName)}";
                    var filePath = Path.Combine(uploadsFolder, fileName);
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await cvFile.CopyToAsync(stream);
                    }
                    
                    volunteer.CvFileName = cvFile.FileName;
                    volunteer.CvFilePath = Path.Combine("uploads", "cvs", fileName);
                    volunteer.CvFileSize = cvFile.Length;
                }

                _context.Volunteers.Add(volunteer);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetVolunteer), new { id = volunteer.Id }, volunteer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating volunteer application");
                return StatusCode(500, new { message = "An error occurred while processing your application." });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Volunteer>> GetVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);

            if (volunteer == null)
            {
                return NotFound();
            }

            return volunteer;
        }
    }

    // DTO for the form data
    public class VolunteerApplicationDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string Faculty { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string StudyYear { get; set; } = string.Empty;
        public string? StudentId { get; set; }
        public string PreferredRole { get; set; } = string.Empty;
        public string? AlternativeRole { get; set; }
        public string? ProgrammingLanguages { get; set; }
        public string? Frameworks { get; set; }
        public string? Tools { get; set; }
        public string? Experience { get; set; }
        public string Motivation { get; set; } = string.Empty;
        public string Contribution { get; set; } = string.Empty;
        public string TimeCommitment { get; set; } = string.Empty;
        public string? Schedule { get; set; }
        public string? PortfolioUrl { get; set; }
        public bool DataProcessingAgreement { get; set; }
        public bool TermsAgreement { get; set; }
    }
}
