// Data/ApplicationDbContext.cs - Add these DbSets and configurations
using Microsoft.EntityFrameworkCore;
using TSGwebsite.Models;

namespace TSGwebsite.Data
{
    public partial class ApplicationDbContext : DbContext
    {
        // Existing DbSets...
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }

        // New DbSets for Reporting System
        public DbSet<Member> Members { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Report> Reports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Existing configurations...

            // Member configuration
            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(20);
                entity.Property(e => e.LinkedInUrl).HasMaxLength(500);
                entity.Property(e => e.GitHubUrl).HasMaxLength(500);
                entity.Property(e => e.ImageUrl).HasMaxLength(500);
                
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Configure enums
                entity.Property(e => e.Department)
                    .HasConversion<string>();
                entity.Property(e => e.Role)
                    .HasConversion<string>();
            });

            // Project configuration
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
                entity.Property(e => e.RepositoryUrl).HasMaxLength(500);
                entity.Property(e => e.LiveUrl).HasMaxLength(500);
                
                // Configure enum
                entity.Property(e => e.Status)
                    .HasConversion<string>();

                // Configure relationships
                entity.HasOne(p => p.ResponsibleMember)
                    .WithMany(m => m.ResponsibleProjects)
                    .HasForeignKey(p => p.ResponsibleMemberId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(p => p.ExecutorMember)
                    .WithMany(m => m.ExecutorProjects)
                    .HasForeignKey(p => p.ExecutorMemberId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(p => p.BeginnerMember)
                    .WithMany(m => m.BeginnerProjects)
                    .HasForeignKey(p => p.BeginnerMemberId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Report configuration
            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.WorkDescription).IsRequired().HasMaxLength(2000);
                entity.Property(e => e.Achievements).HasMaxLength(1000);
                entity.Property(e => e.Challenges).HasMaxLength(1000);
                entity.Property(e => e.NextMonthPlans).HasMaxLength(1000);
                
                // Configure relationships
                entity.HasOne(r => r.Member)
                    .WithMany(m => m.Reports)
                    .HasForeignKey(r => r.MemberId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(r => r.Project)
                    .WithMany(p => p.Reports)
                    .HasForeignKey(r => r.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Composite unique index to prevent duplicate reports
                entity.HasIndex(r => new { r.MemberId, r.ProjectId, r.Month, r.Year })
                    .IsUnique();
            });

            // Seed data
            SeedReportingData(modelBuilder);
        }

        private void SeedReportingData(ModelBuilder modelBuilder)
        {
            // Seed Members
            modelBuilder.Entity<Member>().HasData(
                new Member { Id = 1, FirstName = "Augustin", LastName = "Matea", Email = "augustin.matea@example.com", Department = Department.Management, Role = MemberRole.Founder, IsActive = true, JoinedAt = new DateTime(2020, 1, 1) },
                new Member { Id = 2, FirstName = "Daia", LastName = "Irimia", Email = "daia.irimia@example.com", Department = Department.Management, Role = MemberRole.Coordinator, IsActive = true, JoinedAt = new DateTime(2020, 2, 1) },
                new Member { Id = 3, FirstName = "Andrei", LastName = "Constantin", Email = "andrei.constantin@example.com", Department = Department.Frontend, Role = MemberRole.Lead, IsActive = true, JoinedAt = new DateTime(2021, 3, 1) },
                new Member { Id = 4, FirstName = "Daniel", LastName = "Nwaeke", Email = "daniel.nwaeke@example.com", Department = Department.FullStack, Role = MemberRole.Member, IsActive = true, JoinedAt = new DateTime(2021, 4, 1) },
                new Member { Id = 5, FirstName = "Cristina", LastName = "Gavrilă", Email = "cristina.gavrila@example.com", Department = Department.Mobile, Role = MemberRole.Lead, IsActive = true, JoinedAt = new DateTime(2021, 5, 1) },
                new Member { Id = 6, FirstName = "Bianca", LastName = "Popescu", Email = "bianca.popescu@example.com", Department = Department.GraphicDesign, Role = MemberRole.Member, IsActive = true, JoinedAt = new DateTime(2022, 1, 1) },
                new Member { Id = 7, FirstName = "Eduard", LastName = "Marinescu", Email = "eduard.marinescu@example.com", Department = Department.Backend, Role = MemberRole.Lead, IsActive = true, JoinedAt = new DateTime(2022, 2, 1) },
                new Member { Id = 8, FirstName = "Iulia", LastName = "Ionescu", Email = "iulia.ionescu@example.com", Department = Department.Communication, Role = MemberRole.Member, IsActive = true, JoinedAt = new DateTime(2022, 6, 1) },
                new Member { Id = 9, FirstName = "Victor", LastName = "Stanciu", Email = "victor.stanciu@example.com", Department = Department.Networking, Role = MemberRole.Member, IsActive = true, JoinedAt = new DateTime(2023, 1, 1) },
                new Member { Id = 10, FirstName = "Alexandra", LastName = "Terechoasă", Email = "alexandra.terechoasa@example.com", Department = Department.Frontend, Role = MemberRole.Member, IsActive = true, JoinedAt = new DateTime(2023, 3, 1) }
            );

            // Seed Projects
            modelBuilder.Entity<Project>().HasData(
                new Project { Id = 1, Name = "TSG Website", Description = "Official website for Transilvania Star Group", Status = ProjectStatus.InProgress, StartDate = new DateTime(2024, 1, 1), ResponsibleMemberId = 3, ExecutorMemberId = 4, CreatedAt = DateTime.UtcNow },
                new Project { Id = 2, Name = "Student Portal", Description = "Portal for student management and services", Status = ProjectStatus.Planning, StartDate = new DateTime(2024, 3, 1), ResponsibleMemberId = 7, ExecutorMemberId = 5, CreatedAt = DateTime.UtcNow },
                new Project { Id = 3, Name = "Mobile App", Description = "TSG mobile application for students", Status = ProjectStatus.InProgress, StartDate = new DateTime(2024, 2, 1), ResponsibleMemberId = 5, BeginnerMemberId = 10, CreatedAt = DateTime.UtcNow },
                new Project { Id = 4, Name = "Registratură", Description = "Document management system for university", Status = ProjectStatus.Testing, StartDate = new DateTime(2023, 9, 1), ResponsibleMemberId = 7, ExecutorMemberId = 4, CreatedAt = DateTime.UtcNow },
                new Project { Id = 5, Name = "Marketing Campaign", Description = "Social media and communication strategy", Status = ProjectStatus.InProgress, StartDate = new DateTime(2024, 1, 15), ResponsibleMemberId = 8, CreatedAt = DateTime.UtcNow }
            );

            // Seed Reports (sample data for current month)
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            modelBuilder.Entity<Report>().HasData(
                new Report { Id = 1, MemberId = 3, ProjectId = 1, Month = currentMonth, Year = currentYear, WorkDescription = "Developed new frontend components and improved UI/UX", HoursWorked = 40, Achievements = "Completed responsive design implementation", CreatedAt = DateTime.UtcNow },
                new Report { Id = 2, MemberId = 4, ProjectId = 1, Month = currentMonth, Year = currentYear, WorkDescription = "Backend API development and database optimization", HoursWorked = 35, Achievements = "Improved API performance by 30%", CreatedAt = DateTime.UtcNow },
                new Report { Id = 3, MemberId = 5, ProjectId = 3, Month = currentMonth, Year = currentYear, WorkDescription = "Mobile app development using React Native", HoursWorked = 45, Achievements = "Completed authentication module", CreatedAt = DateTime.UtcNow },
                new Report { Id = 4, MemberId = 7, ProjectId = 2, Month = currentMonth, Year = currentYear, WorkDescription = "Architecture planning and backend setup", HoursWorked = 30, Achievements = "Completed project architecture documentation", CreatedAt = DateTime.UtcNow },
                new Report { Id = 5, MemberId = 8, ProjectId = 5, Month = currentMonth, Year = currentYear, WorkDescription = "Content creation and social media management", HoursWorked = 25, Achievements = "Increased social media engagement by 50%", CreatedAt = DateTime.UtcNow }
            );
        }
    }
}