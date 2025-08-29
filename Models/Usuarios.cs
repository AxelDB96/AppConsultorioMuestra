using System.ComponentModel.DataAnnotations;

namespace WebAppConsultorio.Models
{
    public class Usuarios
    {
        //[Column("id")]
        [Key]
        public int id_usuario { get; set; }
        public string usuario { get; set; }
        public string clave { get; set; }
        public string nombres { get; set; }
        public string apellido { get; set; }
        public int activo { get; set; }
        public int tipo { get; set; }
    }
}
