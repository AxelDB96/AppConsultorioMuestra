using System.ComponentModel.DataAnnotations;

namespace WebAppConsultorio.Models
{
    public class Colegas
    {
        //[Colum("id")]
        [Key]
        public int id_colega { get; set; }
        public string nombres { get; set; }
        public string? apellido { get; set; }
        public string? telefono { get; set; }
        public string? ubicacion { get; set; }
        public string? email { get; set; }
        public string? profesion { get; set; }
    }
}
