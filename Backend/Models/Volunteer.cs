using System.ComponentModel.DataAnnotations;

namespace TSGwebsite.Models
{
    public class Volunteer
    {
        public int Id { get; set; }
        
        // Personal Information
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [Required]
        public DateTime BirthDate { get; set; }
        
        // Academic Information
        [Required]
        [StringLength(200)]
        public string Faculty { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string Specialization { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string StudyYear { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? StudentId { get; set; }
        
        // Role Preferences
        [Required]
        [StringLength(100)]
        public string PreferredRole { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string? AlternativeRole { get; set; }
        
        // Technical Skills
        [StringLength(500)]
        public string? ProgrammingLanguages { get; set; }
        
        [StringLength(500)]
        public string? Frameworks { get; set; }
        
        [StringLength(500)]
        public string? Tools { get; set; }
        
        // Experience and Motivation
        [StringLength(2000)]
        public string? Experience { get; set; }
        
        [Required]
        [StringLength(2000)]
        public string Motivation { get; set; } = string.Empty;
        
        [Required]
        [StringLength(2000)]
        public string Contribution { get; set; } = string.Empty;
        
        // Availability
        [Required]
        [StringLength(100)]
        public string TimeCommitment { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Schedule { get; set; }
        
        // Documents and Portfolio
        [StringLength(500)]
        public string? PortfolioUrl { get; set; }
        
        // CV File
        [StringLength(255)]
        public string? CvFileName { get; set; }
        
        [StringLength(500)]
        public string? CvFilePath { get; set; }
        
        public long? CvFileSize { get; set; }
        
        // Agreements
        public bool DataProcessingAgreement { get; set; } = false;
        public bool TermsAgreement { get; set; } = false;
        
        // Admin Management Fields
        public VolunteerStatus Status { get; set; } = VolunteerStatus.Pending;
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        
        [StringLength(1000)]
        public string? ReviewNotes { get; set; }
        
        public bool IsFavorite { get; set; } = false;
        public DateTime? FavoritedAt { get; set; }
        
        // Activity Tracking
        public DateTime? ContactedAt { get; set; }
        public DateTime? StartedVolunteeringAt { get; set; }
        
        [StringLength(1000)]
        public string? Achievements { get; set; }
        
        public int VolunteerHours { get; set; } = 0;
        
        [StringLength(500)]
        public string? CurrentRole { get; set; }
        
        // Computed Properties
        public int Age => DateTime.Now.Year - BirthDate.Year - 
            (DateTime.Now.DayOfYear < BirthDate.DayOfYear ? 1 : 0);
        
        public string FullName => $"{FirstName} {LastName}";
    }

    public enum VolunteerStatus
    {
        Pending = 0,
        Reviewed = 1,
        Approved = 2,
        Rejected = 3,
        Contacted = 4,
        Active = 5,
        Inactive = 6
    }
}