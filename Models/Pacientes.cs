using System.ComponentModel.DataAnnotations;

namespace WebAppConsultorio.Models
{
    public class Pacientes
    {
        //[Column("id")]
        [Key]
        public int id_paciente { get; set; }
        public string nombres { get; set; }
        public string apellido { get; set; }
        public string documento { get; set; }
        public string? fechaDeNacimiento { get; set; }
        public string? fechaDeAdmision { get; set; }
        public string? ubicacion { get; set; }
        public string? adultoResponsable { get; set; }
        public string? nombresResponsable { get; set; }
        public string? telefonoResponsable { get; set; }
        public string? emailResponsable { get; set; }
        public string? historiaClinica { get; set; }
        public string? seguimientoEvaluacion { get; set; }
        public string? seguimientoTratamiento { get; set; }
        public int activo { get; set; }
    }
}
