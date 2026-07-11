using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TawqiApi.Data;
using TawqiApi.Models;

namespace TawqiApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeadsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeadsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Leads (public — no auth required)
        [HttpPost]
        public async Task<IActionResult> CreateLead([FromBody] CreateLeadRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Phone))
            {
                return BadRequest(new { message = "الاسم ورقم الجوال مطلوبان" });
            }

            var lead = new Lead
            {
                Name = request.Name.Trim(),
                Phone = request.Phone.Trim(),
                PropertyId = request.PropertyId,
                PropertyTitle = request.PropertyTitle ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Leads.Add(lead);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً" });
        }

        // GET: api/Leads (admin only)
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Lead>>> GetLeads()
        {
            var leads = await _context.Leads
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();

            return Ok(leads);
        }

        // GET: api/Leads/unread-count (admin only)
        [HttpGet("unread-count")]
        [Authorize]
        public async Task<IActionResult> GetUnreadCount()
        {
            var count = await _context.Leads.CountAsync(l => !l.IsRead);
            return Ok(new { count });
        }

        // PUT: api/Leads/{id}/read (admin only)
        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null) return NotFound();

            lead.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(lead);
        }

        // DELETE: api/Leads/{id} (admin only)
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteLead(int id)
        {
            var lead = await _context.Leads.FindAsync(id);
            if (lead == null) return NotFound();

            _context.Leads.Remove(lead);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    public class CreateLeadRequest
    {
        public required string Name { get; set; }
        public required string Phone { get; set; }
        public int PropertyId { get; set; }
        public string? PropertyTitle { get; set; }
    }
}
