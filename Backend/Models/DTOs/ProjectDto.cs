namespace TSGwebsite.Models.DTOs
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? RepositoryUrl { get; set; }
        public string? LiveUrl { get; set; }
        public int ResponsibleMemberId { get; set; }
        public string ResponsibleMemberName { get; set; } = string.Empty;
        public int? ExecutorMemberId { get; set; }
        public string? ExecutorMemberName { get; set; }
        public int? BeginnerMemberId { get; set; }
        public string? BeginnerMemberName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateProjectDto
    {
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
    }

    public class UpdateProjectDto
    {
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
    }
}