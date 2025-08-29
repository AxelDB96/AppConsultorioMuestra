using Microsoft.AspNetCore.Mvc;
using WebAppConsultorio.Data;

namespace WebAppConsultorio.Controllers
{
    [Route("Vistas")]
    public class VistasController : Controller
    {
        private readonly AppDBContext _dbContext;
        
        public VistasController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }
        //--------------PACIENTES------------
        [HttpGet("Pacientes")]
        public IActionResult Pacientes()
        {

            return View("~/Views/Paciente/Pacientes.cshtml");
        }

        [HttpGet("pacientesInactivos")]
        public IActionResult pacientesInactivos()
        {
            return View("~/Views/Paciente/pacientesInactivos.cshtml");
        }

        [HttpGet("editarPaciente")]
        public IActionResult editarPaciente()
        {
            return View("~/Views/Paciente/editarPaciente.cshtml");
        }

        [HttpGet("historiaClinica")]
        public IActionResult historiaClinica()
        {
            return View("~/Views/Paciente/historiaClinica.cshtml");
        }

        [HttpGet("seguimientoEvaluacion")]
        public IActionResult seguimientoEvaluacion()
        {
            return View("~/Views/Paciente/seguimientoEvaluacion.cshtml");
        }

        [HttpGet("seguimientoTratamiento")]
        public IActionResult seguimientoTratamiento()
        {
            return View("~/Views/Paciente/seguimientoTratamiento.cshtml");
        }

        //---------COLEGAS------------
        [HttpGet("Colegas")]
        public IActionResult Colegas()
        {

            return View("~/Views/Colega/Colegas.cshtml");
        }

        //---------TURNOS------------
        [HttpGet("Turnos")]
        public IActionResult Turnos()
        {

            return View("~/Views/Turno/Turnos.cshtml");
        }
        [HttpGet("VerTurnos")]
        public IActionResult VerTurnos()
        {

            return View("~/Views/Turno/VerTurnos.cshtml");
        }
        [HttpGet("trunosFinalizados")]
        public IActionResult trunosFinalizados()
        {

            return View("~/Views/Turno/trunosFinalizados.cshtml");
        }
    }
}
