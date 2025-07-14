using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TSGwebsite.Migrations
{
    /// <inheritdoc />
    public partial class InitialSeedFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "$2a$11$eFxXyH/9BDsmjKgMkjj0ze9jkZHr3FTH6pM1HXltzm/fU4NTK44rG" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PasswordHash" },
                values: new object[] { new DateTime(2025, 7, 10, 19, 52, 4, 704, DateTimeKind.Utc).AddTicks(6081), "$2a$11$eMNBk/B02AuOb2FhZq6sM.ip7Ffs/h3wGar39d.Yw7zY9YbtKlywq" });
        }
    }
}
