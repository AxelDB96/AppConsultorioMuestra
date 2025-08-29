using Microsoft.EntityFrameworkCore;
using WebAppConsultorio.Models;
using Microsoft.AspNetCore.Http;

namespace WebAppConsultorio.Data
{
    public class AppDBContext : DbContext
    {
        public AppDBContext(DbContextOptions<AppDBContext> options) : base(options)
        {

        }

        public DbSet<Usuarios> Usuarios { get; set; }
        public DbSet<Pacientes> Pacientes { get; set; }
        public DbSet<Turnos> Turnos { get; set; }
        public DbSet<registroTurnos> registroTurnos { get; set; }
        public DbSet<Colegas> Colegas { get; set; }
    }
}
