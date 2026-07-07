using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TawqiApi.Data;
using TawqiApi.Models;
using TawqiApi.Services;

namespace TawqiApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly SupabaseStorageService _storageService;

        public PropertiesController(ApplicationDbContext context, SupabaseStorageService storageService)
        {
            _context = context;
            _storageService = storageService;
        }

        // GET: api/Properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties(
            [FromQuery] string? region, 
            [FromQuery] string? category)
        {
            var query = _context.Properties.AsQueryable();

            if (!string.IsNullOrEmpty(region))
            {
                query = query.Where(p => p.Region == region);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(p => p.Category == category);
            }

            return await query.ToListAsync();
        }

        // GET: api/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);

            if (property == null)
            {
                return NotFound();
            }

            return property;
        }

        // POST: api/Properties
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Property>> PostProperty(Property property)
        {
            // Process images
            var publicUrls = new List<string>();
            foreach (var image in property.Images)
            {
                if (image.StartsWith("data:image/webp;base64,"))
                {
                    try
                    {
                        var base64Data = image.Substring("data:image/webp;base64,".Length);
                        var imageBytes = Convert.FromBase64String(base64Data);
                        var fileName = $"{Guid.NewGuid()}.webp";
                        
                        var publicUrl = await _storageService.UploadImageAsync(imageBytes, fileName);
                        publicUrls.Add(publicUrl);
                    }
                    catch (Exception ex)
                    {
                        // Log error and return 500 if upload fails
                        return StatusCode(500, $"Failed to upload image: {ex.Message}");
                    }
                }
                else
                {
                    publicUrls.Add(image);
                }
            }
            
            property.Images = publicUrls;

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
        }

        // PUT: api/Properties/5
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProperty(int id, Property property)
        {
            if (id != property.Id)
            {
                return BadRequest();
            }

            _context.Entry(property).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Properties/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
            {
                return NotFound();
            }

            // Auto-cleanup: Delete images from Supabase Storage
            foreach (var imageUrl in property.Images)
            {
                try
                {
                    await _storageService.DeleteImageAsync(imageUrl);
                }
                catch (Exception ex)
                {
                    // If deletion fails, return 500 so the DB record is not orphaned
                    return StatusCode(500, $"Failed to delete image from storage: {ex.Message}");
                }
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PropertyExists(int id)
        {
            return _context.Properties.Any(e => e.Id == id);
        }
    }
}
