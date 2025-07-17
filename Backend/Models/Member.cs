namespace TSGwebsite.Models
{
    public class Member
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public Department Department { get; set; }
        public MemberRole Role { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? ImageUrl { get; set; }

        // Navigation properties
        public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
        public virtual ICollection<Project> ResponsibleProjects { get; set; } = new List<Project>();
        public virtual ICollection<Project> ExecutorProjects { get; set; } = new List<Project>();
        public virtual ICollection<Project> BeginnerProjects { get; set; } = new List<Project>();

        public string FullName => $"{FirstName} {LastName}";
    }

    public enum Department
    {
        Frontend = 0,
        Backend = 1,
        Mobile = 2,
        Communication = 3,
        Networking = 4,
        GraphicDesign = 5,
        FullStack = 6,
        Management = 7
    }

    public enum MemberRole
    {
        Member = 0,
        Lead = 1,
        Coordinator = 2,
        Founder = 3
    }
}