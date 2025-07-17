namespace TSGwebsite.Models
{
    public class Report
    {
        public int Id { get; set; }
        public int MemberId { get; set; }
        public int ProjectId { get; set; }
        public int Month { get; set; } // 1-12
        public int Year { get; set; }
        public string WorkDescription { get; set; } = string.Empty;
        public int HoursWorked { get; set; }
        public string? Achievements { get; set; }
        public string? Challenges { get; set; }
        public string? NextMonthPlans { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Member Member { get; set; } = null!;
        public virtual Project Project { get; set; } = null!;
    }
}