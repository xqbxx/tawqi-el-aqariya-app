using System.Collections.Generic;

namespace TawqiApi.Models
{
    public class Property
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        
        public required string Region { get; set; }
        public string? CustomRegion { get; set; }
        
        public required string Category { get; set; }
        public required string DealType { get; set; }
        
        public double Size { get; set; }
        public bool IsCustomSize { get; set; }
        
        public double StreetWidth { get; set; }
        public required string Direction { get; set; }
        public required string PlotNumber { get; set; }
        
        public required string GoogleMapsUrl { get; set; }
        
        public required string OwnerName { get; set; }
        public required string OwnerPhone { get; set; }
        public required string GuardPhone { get; set; }

        public List<string> Images { get; set; } = new List<string>();
    }
}
