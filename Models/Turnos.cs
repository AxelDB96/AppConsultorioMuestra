using System.ComponentModel.DataAnnotations;

namespace WebAppConsultorio.Models
{
    public class Turnos
    {
        //[Column("id")]
        [Key]
        public int id_turno { get; set; }
        public int id_paciente { get; set; }
        public string nombres { get; set; }
        public string apellido { get; set; }
        public string? documento { get; set; }
        public string? telefono { get; set; }
        public DateTime diaYhora { get; set; }
        public string ubicacion { get; set; }
        public int? activoTurno { get; set; }
    }
}
