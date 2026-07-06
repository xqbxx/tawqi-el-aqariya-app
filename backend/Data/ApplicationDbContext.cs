using Microsoft.EntityFrameworkCore;
using TawqiApi.Models;

namespace TawqiApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Property> Properties { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial admin user
            modelBuilder.Entity<Admin>().HasData(new Admin
            {
                Id = 1,
                Username = "admin",
                // Hashed password for "Admin@123"
                PasswordHash = "$2a$11$Kq2rzt.6sSRnHQH9az.1WOA.l34hevB9.Jo6K5eNLSOqRieAT6X.m"
            });
        }
    }
}
