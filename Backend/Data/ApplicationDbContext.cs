using Microsoft.EntityFrameworkCore;
using TSGwebsite.Models;

namespace TSGwebsite.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Volunteer configuration
            modelBuilder.Entity<Volunteer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Ignore(e => e.Age); // Computed property, don't store in DB
                entity.Ignore(e => e.FullName); // Computed property, don't store in DB
            });

            // BlogPost configuration
            modelBuilder.Entity<BlogPost>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Slug).IsUnique();
                entity.Property(e => e.Content).HasColumnType("nvarchar(max)");
            });

            // User configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasConversion<int>();
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed default admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@tsg.com",
                    PasswordHash = "$2a$11$eFxXyH/9BDsmjKgMkjj0ze9jkZHr3FTH6pM1HXltzm/fU4NTK44rG" ,
                    FirstName = "TSG",
                    LastName = "Administrator",
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = new DateTime(2024, 01, 01)
                }
            );

            // Seed sample blog post
            modelBuilder.Entity<BlogPost>().HasData(
                new BlogPost
                {
                    Id = 1,
                    Title = "Bine ai venit în TSG!",
                    Slug = "bine-ai-venit-in-tsg",
                    Content = "Suntem încântați să lansăm noul nostru sistem de management pentru voluntari...",
                    Summary = "Introducere în programul nostru de voluntariat și cum să începi.",
                    IsPublished = true,
                    CreatedAt = new DateTime(2024, 01, 01),
                    PublishedAt = new DateTime(2024, 01, 01),
                    Author = "TSG Team",
                    Tags = "welcome,volunteer,community,tsg"
                }
            );
        }
    }
}