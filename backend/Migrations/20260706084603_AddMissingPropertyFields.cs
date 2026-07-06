using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TawqiApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMissingPropertyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PropertyType",
                table: "Properties",
                newName: "PlotNumber");

            migrationBuilder.RenameColumn(
                name: "GoogleMapsLink",
                table: "Properties",
                newName: "OwnerPhone");

            migrationBuilder.RenameColumn(
                name: "Area",
                table: "Properties",
                newName: "StreetWidth");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CustomRegion",
                table: "Properties",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DealType",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Direction",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GoogleMapsUrl",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GuardPhone",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsCustomSize",
                table: "Properties",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OwnerName",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Size",
                table: "Properties",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CustomRegion",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "DealType",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Direction",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "GoogleMapsUrl",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "GuardPhone",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "IsCustomSize",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "OwnerName",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Properties");

            migrationBuilder.RenameColumn(
                name: "StreetWidth",
                table: "Properties",
                newName: "Area");

            migrationBuilder.RenameColumn(
                name: "PlotNumber",
                table: "Properties",
                newName: "PropertyType");

            migrationBuilder.RenameColumn(
                name: "OwnerPhone",
                table: "Properties",
                newName: "GoogleMapsLink");
        }
    }
}
