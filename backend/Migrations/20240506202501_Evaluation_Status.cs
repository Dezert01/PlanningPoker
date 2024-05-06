﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PlanningPoker.Migrations
{
    /// <inheritdoc />
    public partial class Evaluation_Status : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CurrentlyEvaluated",
                table: "UserStoryTasks",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentlyEvaluated",
                table: "UserStoryTasks");
        }
    }
}
