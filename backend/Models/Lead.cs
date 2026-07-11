namespace TawqiApi.Models;

public class Lead
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Phone { get; set; }
    public int PropertyId { get; set; }
    public string PropertyTitle { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
}
