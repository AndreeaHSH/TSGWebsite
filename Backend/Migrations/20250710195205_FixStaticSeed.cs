using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSGwebsite.Migrations
{
    /// <inheritdoc />
    public partial class FixStaticSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "BlogPosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 7, 10, 19, 52, 4, 704, DateTimeKind.Utc).AddTicks(6081), "$2a$11$eMNBk/B02AuOb2FhZq6sM.ip7Ffs/h3wGar39d.Yw7zY9YbtKlywq" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "BlogPosts",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PublishedAt" },
                values: new object[] { new DateTime(2025, 7, 10, 19, 47, 40, 637, DateTimeKind.Utc).AddTicks(2653), new DateTime(2025, 7, 10, 19, 47, 40, 637, DateTimeKind.Utc).AddTicks(2799) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 7, 10, 19, 47, 40, 636, DateTimeKind.Utc).AddTicks(4900), "$2a$11$zW5ni1MSIuf3gdQox/msH.Igyj8.9bP08.5yqB/swhWtx1n7fieMq" });
        }
    }
}
