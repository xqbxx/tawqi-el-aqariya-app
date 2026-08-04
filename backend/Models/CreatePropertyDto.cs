using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TawqiApi.Models
{
    public class CreatePropertyDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        [Required]
        public string Region { get; set; } = string.Empty;
        public string? CustomRegion { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        public string DealType { get; set; } = string.Empty;

        public double Size { get; set; }
        public bool IsCustomSize { get; set; }

        public double StreetWidth { get; set; }

        [Required]
        public string Direction { get; set; } = string.Empty;

        [Required]
        public string PlotNumber { get; set; } = string.Empty;

        [Required]
        public string GoogleMapsUrl { get; set; } = string.Empty;

        [Required]
        public string OwnerName { get; set; } = string.Empty;

        public string OwnerPhone { get; set; } = string.Empty;

        public string GuardPhone { get; set; } = string.Empty;

        public IFormFileCollection? Images { get; set; }
    }
}
