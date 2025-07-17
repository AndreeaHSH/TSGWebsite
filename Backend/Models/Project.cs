namespace TSGwebsite.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ProjectStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? RepositoryUrl { get; set; }
        public string? LiveUrl { get; set; }
        public int ResponsibleMemberId { get; set; }
        public int? ExecutorMemberId { get; set; }
        public int? BeginnerMemberId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Member ResponsibleMember { get; set; } = null!;
        public virtual Member? ExecutorMember { get; set; }
        public virtual Member? BeginnerMember { get; set; }
        public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
    }

    public enum ProjectStatus
    {
        Planning = 0,
        InProgress = 1,
        Testing = 2,
        Completed = 3,
        OnHold = 4,
        Cancelled = 5
    }
}