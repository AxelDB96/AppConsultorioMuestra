using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAppConsultorio.Data;
using WebAppConsultorio.Models;

namespace WebAppConsultorio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoController : Controller
    {
        private readonly AppDBContext _dbContext;
        private readonly ILogger<TurnoController> _logger;

        public TurnoController(AppDBContext dbContext, ILogger<TurnoController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        //// Obtener horarios para un día (AJAX)
        //[HttpGet]
        //public IActionResult Horarios(DateTime fecha)
        //{
        //    var horariosOcupados = _dbContext.Turnos
        //        .Where(t => t.diaYhora.Date == fecha.Date)
        //        .Select(t => t.diaYhora.Hour)
        //        .ToList();

        //    var horarios = Enumerable.Range(8, 11).Select(h => new
        //    {
        //        hora = h,
        //        disponible = !horariosOcupados.Contains(h)
        //    });

        //    return Json(horarios);
        //}

        //[HttpGet]
        //public IActionResult BuscarPacientes(string termino)
        //{
        //    var pacientes = _dbContext.Pacientes
        //        .Where(t => t.nombres.StartsWith(termino) || t.apellido.StartsWith(termino) || t.documento.StartsWith(termino))
        //        .GroupBy(t => new { t.nombres, t.apellido, t.documento, t.telefonoResponsable, t.ubicacion })
        //        .Select(g => new {
        //            id_paciente = g.Min(t => t.id_paciente),
        //            g.Key.nombres,
        //            g.Key.apellido,
        //            g.Key.documento,
        //            g.Key.telefonoResponsable,
        //            g.Key.ubicacion
        //        })
        //        .Take(10)
        //        .ToList();

        //    return Json(pacientes);
        //}

        //// Guardar turno
        //[HttpPost]
        //public IActionResult AgendarTurno([FromBody] Turnos turnoPedido)
        //{
        //    // Solución final: sumar un día sin alterar la hora
        //    var original = turnoPedido.diaYhora;

        //    // Creamos una nueva fecha con el día +1 pero misma hora
        //    var fechaHoraAjustada = new DateTime(
        //        original.Year,
        //        original.Month,
        //        original.Day + 1,  // Solo se suma el día
        //        original.Hour - 3,
        //        original.Minute,
        //        0
        //    );

        //    var yaExiste = _dbContext.Turnos.Any(t => t.diaYhora == fechaHoraAjustada);
        //    if (yaExiste)
        //        return BadRequest("Ese horario ya fue agendado.");

        //    var nuevoTurno = new Turnos
        //    {
        //        id_paciente = turnoPedido.id_paciente,
        //        nombres = turnoPedido.nombres,
        //        apellido = turnoPedido.apellido,
        //        documento = turnoPedido.documento,
        //        telefono = turnoPedido.telefono,
        //        diaYhora = fechaHoraAjustada,
        //        ubicacion = turnoPedido.ubicacion
        //    };

        //    _dbContext.Turnos.Add(nuevoTurno);
        //    _dbContext.SaveChanges();

        //    return Ok("Turno agendado con éxito.");
        //}


        //pruebas

        //[HttpGet("horarios")]
        //public async Task<IActionResult> ObtenerHorarios([FromQuery] DateTime fecha)
        //{
        //    try
        //    {
        //        var horariosOcupados = await _dbContext.Turnos
        //            .Where(t => t.diaYhora.Date == fecha.Date)
        //            .Select(t => t.diaYhora.Hour)
        //            .ToListAsync();

        //        var horarios = Enumerable.Range(8, 11).Select(h => new
        //        {
        //            hora = h,
        //            disponible = !horariosOcupados.Contains(h)
        //        });

        //        return Ok(horarios);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error al obtener los horarios disponibles.");
        //        return StatusCode(500, "Ocurrió un error al obtener los horarios.");
        //    }
        //}

        [HttpGet("horarios")]
        public async Task<IActionResult> ObtenerHorarios([FromQuery] DateTime fecha)
        {
            try
            {
                // Obtenemos todos los horarios ocupados con hora y minuto
                var horariosOcupados = await _dbContext.Turnos
                    .Where(t => t.diaYhora.Date == fecha.Date)
                    .Select(t => new { t.diaYhora.Hour, t.diaYhora.Minute })
                    .ToListAsync();

                var horarios = new List<object>();

                // Generar horarios de 30 minutos desde las 8:00 hasta las 18:00
                for (int hora = 8; hora < 18; hora++)
                {
                    foreach (int minuto in new[] { 0, 30 })
                    {
                        bool ocupado = horariosOcupados.Any(h => h.Hour == hora && h.Minute == minuto);

                        horarios.Add(new
                        {
                            hora,
                            minuto,
                            disponible = !ocupado
                        });
                    }
                }

                return Ok(horarios);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener los horarios disponibles.");
                return StatusCode(500, "Ocurrió un error al obtener los horarios.");
            }
        }





        [HttpGet("buscar-pacientes")]
        public async Task<IActionResult> BuscarPacientesS([FromQuery] string termino)
        {
            try
            {
                var pacientes = await _dbContext.Pacientes
                    .Where(p => p.nombres.StartsWith(termino) ||
                                p.apellido.StartsWith(termino) ||
                                p.documento.StartsWith(termino))
                    .GroupBy(p => new { p.nombres, p.apellido, p.documento, p.telefonoResponsable, p.ubicacion })
                    .Select(g => new {
                        id_paciente = g.Min(p => p.id_paciente),
                        g.Key.nombres,
                        g.Key.apellido,
                        g.Key.documento,
                        g.Key.telefonoResponsable,
                        g.Key.ubicacion
                    })
                    .Take(10)
                    .ToListAsync();

                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al buscar pacientes.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }


        [HttpPost("agendarTurno")]
        public async Task<IActionResult> AgendarTurnos([FromBody] Turnos turnoPedido)
        {
            try
            {
                // Ajustamos solo el día, manteniendo la hora
                var original = turnoPedido.diaYhora;
                var fechaHoraAjustada = new DateTime(
                    original.Year,
                    original.Month,
                    original.Day + 1,
                    original.Hour - 3,
                    original.Minute,
                    0
                );

                var yaExiste = await _dbContext.Turnos
                    .AnyAsync(t => t.diaYhora == fechaHoraAjustada);

                if (yaExiste)
                    return BadRequest("Ese horario ya fue agendado.");

                var nuevoTurno = new Turnos
                {
                    id_paciente = turnoPedido.id_paciente,
                    nombres = turnoPedido.nombres,
                    apellido = turnoPedido.apellido,
                    documento = turnoPedido.documento,
                    telefono = turnoPedido.telefono,
                    diaYhora = fechaHoraAjustada,
                    ubicacion = turnoPedido.ubicacion,
                    activoTurno = 1
                    //activo 1 - desactivado 2
                };

                _dbContext.Turnos.Add(nuevoTurno);
                await _dbContext.SaveChangesAsync();

                return Ok("Turno agendado con éxito.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al agendar turno.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }

        //finn

        // Endpoint para obtener todos los turnos
        [HttpGet("obtenerTodos")]
        public async Task<IActionResult> ObtenerTodosLosTurnos()
        {
            try
            {
                var turnos = await _dbContext.Turnos
                    .Where(t => t.activoTurno == 1) //Busco solo los turnos activos
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(turnos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los turnos.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }

        // Endpoint para obtener todos los turnos finalizados
        [HttpGet("obtenerTodosFinalizados")]
        public async Task<IActionResult> ObtenerTodosLosTurnosFinalizados()
        {
            try
            {
                var turnos = await _dbContext.Turnos
                    .Where(t => t.activoTurno == 2) //Busco solo los turnos finalizados
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(turnos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los turnos.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }

        

        //endpoint para traer un solo turno mediante su id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTurno(int id)
        {
            var turno = await _dbContext.Turnos.FindAsync(id);
            if (turno == null)
            {
                return NotFound(new { mensaje = "turno no encontrado" });
            }
            return Ok(turno);
        }

        [HttpPut("FinalizarTurno/{idFinalizarT}")]
        public async Task<IActionResult> FinalizarTurno(int idFinalizarT)
        {
            var turnoParaFinalizar = await _dbContext.Turnos.FindAsync(idFinalizarT);

            if (turnoParaFinalizar == null)
                return NotFound(new { mensaje = "Turno no encontrado" });

            turnoParaFinalizar.activoTurno = 2;
            _dbContext.Turnos.Update(turnoParaFinalizar);
            await _dbContext.SaveChangesAsync();

            return Ok(new { mensaje = "Turno finalizado correctamente" });
        }

        [HttpDelete("eliminarTurno/{idEliminar}")]
        public async Task<IActionResult> eliminarTurno(int idEliminar)
        {

            try
            {
                var turnoEliminar = await _dbContext.Turnos.FindAsync(idEliminar);

                if (turnoEliminar == null)
                {
                    return NotFound(new { mensaje = "Turno no encontrado" });
                }

                _dbContext.Turnos.Remove(turnoEliminar);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Turno eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

    }
}
