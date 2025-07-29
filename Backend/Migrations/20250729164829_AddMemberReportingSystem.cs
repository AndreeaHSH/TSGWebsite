using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSGwebsite.Migrations
{
    /// <inheritdoc />
    public partial class AddMemberReportingSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6502), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6500) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6506), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6505) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6508), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6507) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6510), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6509) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6512), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6511) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6604), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6601) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6606), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6605) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6609), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6607) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6611), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6610) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6613), new DateTime(2025, 7, 29, 16, 48, 28, 910, DateTimeKind.Utc).AddTicks(6612) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3531), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3529) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3534), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3533) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3536), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3535) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3538), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3537) });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3540), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3539) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3661), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3659) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3664), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3662) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3665), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3664) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3667), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3666) });

            migrationBuilder.UpdateData(
                table: "Reports",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "CreatedAt", "UpdatedAt" },
                values: new object[] { new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3669), new DateTime(2025, 7, 19, 2, 19, 57, 759, DateTimeKind.Utc).AddTicks(3668) });
        }
    }
}
