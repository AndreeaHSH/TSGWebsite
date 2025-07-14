using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSGwebsite.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Summary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FeaturedImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Tags = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Author = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Volunteers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Faculty = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Specialization = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StudyYear = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PreferredRole = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AlternativeRole = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProgrammingLanguages = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Frameworks = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Tools = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Experience = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    Motivation = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Contribution = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    TimeCommitment = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Schedule = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    PortfolioUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CvFileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CvFilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CvFileSize = table.Column<long>(type: "bigint", nullable: true),
                    DataProcessingAgreement = table.Column<bool>(type: "bit", nullable: false),
                    TermsAgreement = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    IsFavorite = table.Column<bool>(type: "bit", nullable: false),
                    FavoritedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ContactedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StartedVolunteeringAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Achievements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    VolunteerHours = table.Column<int>(type: "int", nullable: false),
                    CurrentRole = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Volunteers", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "BlogPosts",
                columns: new[] { "Id", "Author", "Content", "CreatedAt", "FeaturedImage", "IsPublished", "PublishedAt", "Slug", "Summary", "Tags", "Title", "ViewCount" },
                values: new object[] { 1, "TSG Team", "Suntem încântați să lansăm noul nostru sistem de management pentru voluntari...", new DateTime(2025, 7, 10, 19, 47, 40, 637, DateTimeKind.Utc).AddTicks(2653), null, true, new DateTime(2025, 7, 10, 19, 47, 40, 637, DateTimeKind.Utc).AddTicks(2799), "bine-ai-venit-in-tsg", "Introducere în programul nostru de voluntariat și cum să începi.", "welcome,volunteer,community,tsg", "Bine ai venit în TSG!", 0 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastLoginAt", "LastName", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, new DateTime(2025, 7, 10, 19, 47, 40, 636, DateTimeKind.Utc).AddTicks(4900), "admin@tsg.com", "TSG", true, null, "Administrator", "$2a$11$zW5ni1MSIuf3gdQox/msH.Igyj8.9bP08.5yqB/swhWtx1n7fieMq", 0, "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_BlogPosts_Slug",
                table: "BlogPosts",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Volunteers_Email",
                table: "Volunteers",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogPosts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Volunteers");
        }
    }
}
