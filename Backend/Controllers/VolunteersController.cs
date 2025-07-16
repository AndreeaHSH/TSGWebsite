// Backend/Controllers/VolunteersController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Data;
using TSGwebsite.Models;
using TSGwebsite.Services;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VolunteersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<VolunteersController> _logger;
        private readonly IEmailService _emailService;
        private readonly IPdfService _pdfService;

        public VolunteersController(
            ApplicationDbContext context, 
            ILogger<VolunteersController> logger,
            IEmailService emailService,
            IPdfService pdfService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
            _pdfService = pdfService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VolunteerListDto>>> GetVolunteers()
        {
            var volunteers = await _context.Volunteers
                .Select(v => new VolunteerListDto
                {
                    Id = v.Id,
                    FullName = v.FullName,
                    Email = v.Email,
                    Phone = v.Phone,
                    Faculty = v.Faculty,
                    Specialization = v.Specialization,
                    StudyYear = v.StudyYear,
                    PreferredRole = v.PreferredRole,
                    Status = v.Status,
                    SubmittedAt = v.SubmittedAt,
                    IsFavorite = v.IsFavorite,
                    HasCv = !string.IsNullOrEmpty(v.CvFileName),
                    CurrentRole = v.CurrentRole,
                    VolunteerHours = v.VolunteerHours,
                    Age = v.Age
                })
                .OrderByDescending(v => v.SubmittedAt)
                .ToListAsync();

            return Ok(volunteers);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VolunteerDetailDto>> GetVolunteer(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);

            if (volunteer == null)
            {
                return NotFound();
            }

            var volunteerDetail = new VolunteerDetailDto
            {
                Id = volunteer.Id,
                FirstName = volunteer.FirstName,
                LastName = volunteer.LastName,
                FullName = volunteer.FullName,
                Email = volunteer.Email,
                Phone = volunteer.Phone,
                BirthDate = volunteer.BirthDate,
                Age = volunteer.Age,
                Faculty = volunteer.Faculty,
                Specialization = volunteer.Specialization,
                StudyYear = volunteer.StudyYear,
                StudentId = volunteer.StudentId,
                PreferredRole = volunteer.PreferredRole,
                AlternativeRole = volunteer.AlternativeRole,
                ProgrammingLanguages = volunteer.ProgrammingLanguages,
                Frameworks = volunteer.Frameworks,
                Tools = volunteer.Tools,
                Experience = volunteer.Experience,
                Motivation = volunteer.Motivation,
                Contribution = volunteer.Contribution,
                TimeCommitment = volunteer.TimeCommitment,
                Schedule = volunteer.Schedule,
                PortfolioUrl = volunteer.PortfolioUrl,
                CvFileName = volunteer.CvFileName,
                CvFileSize = volunteer.CvFileSize,
                DataProcessingAgreement = volunteer.DataProcessingAgreement,
                TermsAgreement = volunteer.TermsAgreement,
                Status = volunteer.Status,
                SubmittedAt = volunteer.SubmittedAt,
                ReviewedAt = volunteer.ReviewedAt,
                ReviewNotes = volunteer.ReviewNotes,
                IsFavorite = volunteer.IsFavorite,
                FavoritedAt = volunteer.FavoritedAt,
                ContactedAt = volunteer.ContactedAt,
                StartedVolunteeringAt = volunteer.StartedVolunteeringAt,
                Achievements = volunteer.Achievements,
                VolunteerHours = volunteer.VolunteerHours,
                CurrentRole = volunteer.CurrentRole
            };

            return Ok(volunteerDetail);
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

                // Send email notification to HR
                try
                {
                    var emailSent = await _emailService.SendNewApplicationNotificationAsync(volunteer);
                    if (emailSent)
                    {
                        _logger.LogInformation($"Email notification sent successfully for volunteer: {volunteer.FullName}");
                    }
                    else
                    {
                        _logger.LogWarning($"Failed to send email notification for volunteer: {volunteer.FullName}");
                    }
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, $"Error sending email notification for volunteer: {volunteer.FullName}");
                    // Don't fail the entire request if email fails
                }

                return CreatedAtAction(nameof(GetVolunteer), new { id = volunteer.Id }, volunteer);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating volunteer application");
                return StatusCode(500, new { message = "An error occurred while processing your application." });
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateVolunteerStatus(int id, [FromBody] VolunteerStatusUpdateDto statusUpdate)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            volunteer.Status = statusUpdate.Status;
            volunteer.ReviewNotes = statusUpdate.ReviewNotes;
            volunteer.ReviewedAt = DateTime.UtcNow;

            if (statusUpdate.ContactedAt.HasValue)
                volunteer.ContactedAt = statusUpdate.ContactedAt;

            if (statusUpdate.StartedVolunteeringAt.HasValue)
                volunteer.StartedVolunteeringAt = statusUpdate.StartedVolunteeringAt;

            if (!string.IsNullOrEmpty(statusUpdate.Achievements))
                volunteer.Achievements = statusUpdate.Achievements;

            if (statusUpdate.VolunteerHours.HasValue)
                volunteer.VolunteerHours = statusUpdate.VolunteerHours.Value;

            if (!string.IsNullOrEmpty(statusUpdate.CurrentRole))
                volunteer.CurrentRole = statusUpdate.CurrentRole;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/favorite")]
        public async Task<IActionResult> ToggleFavorite(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null)
            {
                return NotFound();
            }

            volunteer.IsFavorite = !volunteer.IsFavorite;
            volunteer.FavoritedAt = volunteer.IsFavorite ? DateTime.UtcNow : null;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("{id}/cv")]
        public async Task<IActionResult> DownloadCv(int id)
        {
            var volunteer = await _context.Volunteers.FindAsync(id);
            if (volunteer == null || string.IsNullOrEmpty(volunteer.CvFilePath))
            {
                return NotFound();
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), volunteer.CvFilePath);
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound();
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var fileName = volunteer.CvFileName ?? "CV.pdf";

            return File(fileBytes, "application/octet-stream", fileName);
        }

        [HttpGet("{id}/download-pdf")]
        public async Task<IActionResult> DownloadApplicationPdf(int id)
        {
            try
            {
                var volunteer = await _context.Volunteers.FindAsync(id);
                if (volunteer == null)
                {
                    return NotFound("Volunteer application not found.");
                }

                // Generate PDF
                var pdfBytes = await _pdfService.GenerateVolunteerApplicationPdfAsync(volunteer);
                
                // Create filename
                var fileName = $"Aplicatie_TSG_{volunteer.FirstName}_{volunteer.LastName}_{volunteer.Id}_{DateTime.Now:yyyyMMdd}.pdf";
                
                // Return PDF file
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error generating PDF for volunteer {id}");
                return StatusCode(500, new { message = "An error occurred while generating the PDF." });
            }
        }

        [HttpGet("reports")]
        public async Task<ActionResult> GetVolunteerReports()
        {
            var totalVolunteers = await _context.Volunteers.CountAsync();
            var pendingVolunteers = await _context.Volunteers.CountAsync(v => v.Status == VolunteerStatus.Pending);
            var activeVolunteers = await _context.Volunteers.CountAsync(v => v.Status == VolunteerStatus.Active);
            var approvedVolunteers = await _context.Volunteers.CountAsync(v => v.Status == VolunteerStatus.Approved);
            var totalVolunteerHours = await _context.Volunteers.SumAsync(v => v.VolunteerHours);

            // Monthly statistics
            var thisMonth = DateTime.UtcNow.Date.AddDays(1 - DateTime.UtcNow.Day);
            var newApplicationsThisMonth = await _context.Volunteers
                .CountAsync(v => v.SubmittedAt >= thisMonth);

            var reports = new
            {
                TotalVolunteers = totalVolunteers,
                PendingVolunteers = pendingVolunteers,
                ActiveVolunteers = activeVolunteers,
                ApprovedVolunteers = approvedVolunteers,
                TotalVolunteerHours = totalVolunteerHours,
                NewApplicationsThisMonth = newApplicationsThisMonth,
                LastUpdated = DateTime.UtcNow
            };

            return Ok(reports);
        }
    }

    // DTOs for the API
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

    public class VolunteerListDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Faculty { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string StudyYear { get; set; } = string.Empty;
        public string PreferredRole { get; set; } = string.Empty;
        public VolunteerStatus Status { get; set; }
        public DateTime SubmittedAt { get; set; }
        public bool IsFavorite { get; set; }
        public bool HasCv { get; set; }
        public string? CurrentRole { get; set; }
        public int VolunteerHours { get; set; }
        public int Age { get; set; }
    }

    public class VolunteerDetailDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public int Age { get; set; }
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
        public string? CvFileName { get; set; }
        public long? CvFileSize { get; set; }
        public bool DataProcessingAgreement { get; set; }
        public bool TermsAgreement { get; set; }
        public VolunteerStatus Status { get; set; }
        public DateTime SubmittedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewNotes { get; set; }
        public bool IsFavorite { get; set; }
        public DateTime? FavoritedAt { get; set; }
        public DateTime? ContactedAt { get; set; }
        public DateTime? StartedVolunteeringAt { get; set; }
        public string? Achievements { get; set; }
        public int VolunteerHours { get; set; }
        public string? CurrentRole { get; set; }
    }

    public class VolunteerStatusUpdateDto
    {
        public VolunteerStatus Status { get; set; }
        public string? ReviewNotes { get; set; }
        public DateTime? ContactedAt { get; set; }
        public DateTime? StartedVolunteeringAt { get; set; }
        public string? Achievements { get; set; }
        public int? VolunteerHours { get; set; }
        public string? CurrentRole { get; set; }
    }
}