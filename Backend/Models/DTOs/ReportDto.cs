namespace TSGwebsite.Models.DTOs
{
    public class ReportDto
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public string MemberName { get; set; } = string.Empty;
        public string MemberDepartment { get; set; } = string.Empty;
        public int ProjectId { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public int Month { get; set; }
        public int Year { get; set; }
        public string WorkDescription { get; set; } = string.Empty;
        public int HoursWorked { get; set; }
        public string? Achievements { get; set; }
        public string? Challenges { get; set; }
        public string? NextMonthPlans { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateReportDto
    {
        public int MemberId { get; set; }
        public int ProjectId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string WorkDescription { get; set; } = string.Empty;
        public int HoursWorked { get; set; }
        public string? Achievements { get; set; }
        public string? Challenges { get; set; }
        public string? NextMonthPlans { get; set; }
    }

    public class UpdateReportDto
    {
        public string WorkDescription { get; set; } = string.Empty;
        public int HoursWorked { get; set; }
        public string? Achievements { get; set; }
        public string? Challenges { get; set; }
        public string? NextMonthPlans { get; set; }
    }
}