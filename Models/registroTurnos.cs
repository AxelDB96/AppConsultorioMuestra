using System.ComponentModel.DataAnnotations;

namespace WebAppConsultorio.Models
{
    public class registroTurnos
    {
        //[Column("id")]
        [Key]
        public int id_registroTurnos { get; set; }
        public string id_paciente { get; set; }
        public string nombres { get; set; }
        public string apellido { get; set; }
        public string documento { get; set; }
        public DateTime diaYhoraInicio { get; set; }
        public DateTime? diaYhoraFin { get; set; }
        public string observaciones { get; set; }
    }
}
