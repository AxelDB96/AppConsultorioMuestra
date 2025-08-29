using Microsoft.AspNetCore.Mvc;
using WebAppConsultorio.Models;
using WebAppConsultorio.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Numerics;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;


namespace WebAppConsultorio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class PacienteController : Controller
    {
        private readonly AppDBContext _dbContext;
        private readonly ILogger<PacienteController> _logger;

        public PacienteController(AppDBContext dbContext, ILogger<PacienteController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        //endpoint para traer un solo paciente mediante su id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaciente(int id)
        {
            var paciente = await _dbContext.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                return NotFound(new { mensaje = "Paciente no encontrado" });
            }
            return Ok(paciente);
        }

        // Endpoint para obtener todos los pacientes
        [HttpGet("obtenerTodos")]
        public async Task<IActionResult> ObtenerTodosLosPacientes()
        {
            try
            {
                var registros = await _dbContext.Pacientes
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(registros); // No es necesario verificar si está vacío
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los pacientes.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }

        [HttpGet("totalPacientesActivos")]
        public async Task<IActionResult> GetTotalPacientesActivos()
        {
            var total = await _dbContext.Pacientes.CountAsync(p => p.activo == 1);
            return Ok(total);
        }

        //Endpoint que verifica el DNI
        [HttpGet("verificarDNI")]
        public async Task<IActionResult> VerificarDNI(string dni)
        {
            var pacienteExistente = await _dbContext.Pacientes.FirstOrDefaultAsync(p => p.documento == dni);
            if (pacienteExistente != null)
            {
                return Ok(new { existe = true });
            }
            return Ok(new { existe = false });
        }

        //endpoint para la creacion de pacientes
        [HttpPost("crearPaciente")]
        public async Task<IActionResult> PostPaciente([FromBody] Pacientes paciente)
        {
            try
            {
                if (paciente == null)
                {
                    return BadRequest(new { error = "El paciente no puede ser nulo" });
                }

                await _dbContext.Pacientes.AddAsync(paciente);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Paciente creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


        //endpoint para actualizar los datos de los pacientes
        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarPaciente([FromBody] Pacientes pacienteActualizado)
        {
            if (pacienteActualizado == null || pacienteActualizado.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var pacienteExistente = await _dbContext.Pacientes.FindAsync(pacienteActualizado.id_paciente);
                if (pacienteExistente == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                }

                // Actualizar los datos del paciente
                pacienteExistente.nombres = pacienteActualizado.nombres;
                pacienteExistente.apellido = pacienteActualizado.apellido;
                pacienteExistente.documento = pacienteActualizado.documento;
                pacienteExistente.fechaDeNacimiento = pacienteActualizado.fechaDeNacimiento;
                pacienteExistente.ubicacion = pacienteActualizado.ubicacion;
                pacienteExistente.adultoResponsable = pacienteActualizado.adultoResponsable;
                pacienteExistente.nombresResponsable = pacienteActualizado.nombresResponsable;
                pacienteExistente.telefonoResponsable = pacienteActualizado.telefonoResponsable;
                pacienteExistente.emailResponsable = pacienteActualizado.emailResponsable;

                _dbContext.Pacientes.Update(pacienteExistente);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

        [HttpPut("historiaClinica")]
        public async Task<IActionResult> historiaClinicaPaciente([FromBody] Pacientes pacientehistoriaClinica)
        {
            if (pacientehistoriaClinica == null || pacientehistoriaClinica.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos: ID de paciente requerido" });
            }

            try
            {
                var PacienteAactualizarHIS = await _dbContext.Pacientes.FindAsync(pacientehistoriaClinica.id_paciente);
                if (PacienteAactualizarHIS == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado. f" });
                }

                // Actualizar los datos del paciente
                PacienteAactualizarHIS.historiaClinica = pacientehistoriaClinica.historiaClinica;

                _dbContext.Pacientes.Update(PacienteAactualizarHIS);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }


        [HttpPut("seguimientoTratamiento")]
        public async Task<IActionResult> seguimientoTratamiento([FromBody] Pacientes pacienteseguimientoTratamiento)
        {
            if (pacienteseguimientoTratamiento == null || pacienteseguimientoTratamiento.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var seguimientoExistente = await _dbContext.Pacientes.FindAsync(pacienteseguimientoTratamiento.id_paciente);
                if (seguimientoExistente == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                }

                // Actualizar los datos del paciente
                seguimientoExistente.seguimientoTratamiento = pacienteseguimientoTratamiento.seguimientoTratamiento;

                _dbContext.Pacientes.Update(seguimientoExistente);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

        [HttpPut("seguimientoEvaluacion")]
        public async Task<IActionResult> seguimientoEvaluacion([FromBody] Pacientes pacienteseguimientoEvaluacion)
        {
            if (pacienteseguimientoEvaluacion == null || pacienteseguimientoEvaluacion.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var evaluacionExistente = await _dbContext.Pacientes.FindAsync(pacienteseguimientoEvaluacion.id_paciente);
                if (evaluacionExistente == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                }

                // Actualizar los datos del paciente
                evaluacionExistente.seguimientoEvaluacion = pacienteseguimientoEvaluacion.seguimientoEvaluacion;

                _dbContext.Pacientes.Update(evaluacionExistente);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

        [HttpPut("desactivarPaciente")]
        public async Task<IActionResult> desactivarPaciente([FromBody] Pacientes pacienteaDesactivado)
        {
            if (pacienteaDesactivado == null || pacienteaDesactivado.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var pacienteActivo = await _dbContext.Pacientes.FindAsync(pacienteaDesactivado.id_paciente);
                if (pacienteActivo == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                }

                // 2 inactivo
                pacienteActivo.activo = 2;

                _dbContext.Pacientes.Update(pacienteActivo);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente desactivado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

        [HttpPut("activarPaciente")]
        public async Task<IActionResult> activarPaciente([FromBody] Pacientes pacienteaActivado)
        {
            if (pacienteaActivado == null || pacienteaActivado.id_paciente == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var pacienteInactivo = await _dbContext.Pacientes.FindAsync(pacienteaActivado.id_paciente);
                if (pacienteInactivo == null)
                {
                    return NotFound(new { mensaje = "Paciente no encontrado" });
                }

                // 2 inactivo
                pacienteInactivo.activo = 1;

                _dbContext.Pacientes.Update(pacienteInactivo);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Paciente activado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

    }
}
