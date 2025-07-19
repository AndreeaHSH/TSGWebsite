using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TSGwebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddReportingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Volunteers_Email",
                table: "Volunteers");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Username",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_BlogPosts_Slug",
                table: "BlogPosts");

            migrationBuilder.DeleteData(
                table: "BlogPosts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Department = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LinkedInUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    GitHubUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RepositoryUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    LiveUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ResponsibleMemberId = table.Column<int>(type: "int", nullable: false),
                    ExecutorMemberId = table.Column<int>(type: "int", nullable: true),
                    BeginnerMemberId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Projects_Members_BeginnerMemberId",
                        column: x => x.BeginnerMemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Projects_Members_ExecutorMemberId",
                        column: x => x.ExecutorMemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Projects_Members_ResponsibleMemberId",
                        column: x => x.ResponsibleMemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Reports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MemberId = table.Column<int>(type: "int", nullable: false),
                    ProjectId = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    WorkDescription = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    HoursWorked = table.Column<int>(type: "int", nullable: false),
                    Achievements = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Challenges = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    NextMonthPlans = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reports_Members_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Members",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reports_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Members",
                columns: new[] { "Id", "Department", "Email", "FirstName", "GitHubUrl", "ImageUrl", "IsActive", "JoinedAt", "LastName", "LinkedInUrl", "Phone", "Role" },
                values: new object[,]
                {
                    { 1, "Management", "augustin.matea@example.com", "Augustin", null, null, true, new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Matea", null, null, "Founder" },
                    { 2, "Management", "daia.irimia@example.com", "Daia", null, null, true, new DateTime(2020, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Irimia", null, null, "Coordinator" },
                    { 3, "Frontend", "andrei.constantin@example.com", "Andrei", null, null, true, new DateTime(2021, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Constantin", null, null, "Lead" },
                    { 4, "FullStack", "daniel.nwaeke@example.com", "Daniel", null, null, true, new DateTime(2021, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Nwaeke", null, null, "Member" },
                    { 5, "Mobile", "cristina.gavrila@example.com", "Cristina", null, null, true, new DateTime(2021, 5, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Gavrilă", null, null, "Lead" },
                    { 6, "GraphicDesign", "bianca.popescu@example.com", "Bianca", null, null, true, new DateTime(2022, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Popescu", null, null, "Member" },
                    { 7, "Backend", "eduard.marinescu@example.com", "Eduard", null, null, true, new DateTime(2022, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Marinescu", null, null, "Lead" },
                    { 8, "Communication", "iulia.ionescu@example.com", "Iulia", null, null, true, new DateTime(2022, 6, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Ionescu", null, null, "Member" },
                    { 9, "Networking", "victor.stanciu@example.com", "Victor", null, null, true, new DateTime(2023, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Stanciu", null, null, "Member" },
                    { 10, "Frontend", "alexandra.terechoasa@example.com", "Alexandra", null, null, true, new DateTime(2023, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Terechoasă", null, null, "Member" }
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "BeginnerMemberId", "CreatedAt", "Description", "EndDate", "ExecutorMemberId", "LiveUrl", "Name", "RepositoryUrl", "ResponsibleMemberId", "StartDate", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8526), "Official website for Transilvania Star Group", null, 4, null, "TSG Website", null, 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "InProgress", new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8523) },
                    { 2, null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8529), "Portal for student management and services", null, 5, null, "Student Portal", null, 7, new DateTime(2024, 3, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Planning", new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8527) },
                    { 3, 10, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8531), "TSG mobile application for students", null, null, null, "Mobile App", null, 5, new DateTime(2024, 2, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "InProgress", new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8530) },
                    { 4, null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8533), "Document management system for university", null, 4, null, "Registratură", null, 7, new DateTime(2023, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Testing", new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8532) },
                    { 5, null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8535), "Social media and communication strategy", null, null, null, "Marketing Campaign", null, 8, new DateTime(2024, 1, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "InProgress", new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8534) }
                });

            migrationBuilder.InsertData(
                table: "Reports",
                columns: new[] { "Id", "Achievements", "Challenges", "CreatedAt", "HoursWorked", "MemberId", "Month", "NextMonthPlans", "ProjectId", "UpdatedAt", "WorkDescription", "Year" },
                values: new object[,]
                {
                    { 1, "Completed responsive design implementation", null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8626), 40, 3, 7, null, 1, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8624), "Developed new frontend components and improved UI/UX", 2025 },
                    { 2, "Improved API performance by 30%", null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8628), 35, 4, 7, null, 1, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8627), "Backend API development and database optimization", 2025 },
                    { 3, "Completed authentication module", null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8630), 45, 5, 7, null, 3, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8629), "Mobile app development using React Native", 2025 },
                    { 4, "Completed project architecture documentation", null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8668), 30, 7, 7, null, 2, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8667), "Architecture planning and backend setup", 2025 },
                    { 5, "Increased social media engagement by 50%", null, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8670), 25, 8, 7, null, 5, new DateTime(2025, 7, 19, 1, 22, 32, 608, DateTimeKind.Utc).AddTicks(8669), "Content creation and social media management", 2025 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Members_Email",
                table: "Members",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Projects_BeginnerMemberId",
                table: "Projects",
                column: "BeginnerMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ExecutorMemberId",
                table: "Projects",
                column: "ExecutorMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ResponsibleMemberId",
                table: "Projects",
                column: "ResponsibleMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_MemberId_ProjectId_Month_Year",
                table: "Reports",
                columns: new[] { "MemberId", "ProjectId", "Month", "Year" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_ProjectId",
                table: "Reports",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reports");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Members");

            migrationBuilder.InsertData(
                table: "BlogPosts",
                columns: new[] { "Id", "Author", "Content", "CreatedAt", "FeaturedImage", "IsPublished", "PublishedAt", "Slug", "Summary", "Tags", "Title", "ViewCount" },
                values: new object[] { 1, "TSG Team", "Suntem încântați să lansăm noul nostru sistem de management pentru voluntari...", new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, true, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "bine-ai-venit-in-tsg", "Introducere în programul nostru de voluntariat și cum să începi.", "welcome,volunteer,community,tsg", "Bine ai venit în TSG!", 0 });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastLoginAt", "LastName", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "admin@tsg.com", "TSG", true, null, "Administrator", "$2a$11$eFxXyH/9BDsmjKgMkjj0ze9jkZHr3FTH6pM1HXltzm/fU4NTK44rG", 0, "admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Volunteers_Email",
                table: "Volunteers",
                column: "Email",
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
                name: "IX_BlogPosts_Slug",
                table: "BlogPosts",
                column: "Slug",
                unique: true);
        }
    }
}
