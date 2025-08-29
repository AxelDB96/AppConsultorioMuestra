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
    public class ColegaController : Controller
    {
        private readonly AppDBContext _dbContext;
        private readonly ILogger<ColegaController> _logger;

        public ColegaController(AppDBContext dbContext, ILogger<ColegaController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        //endpoint para traer un solo Contacto mediante su id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetColega(int id)
        {
            var contacto = await _dbContext.Colegas.FindAsync(id);
            if (contacto == null)
            {
                return NotFound(new { mensaje = "Contacto no encontrado" });
            }
            return Ok(contacto);
        }

        // Endpoint para obtener todos los colegas
        [HttpGet("obtenerTodos")]
        public async Task<IActionResult> ObtenerTodosLosColegas()
        {
            try
            {
                var contactos = await _dbContext.Colegas
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(contactos); // No es necesario verificar si está vacío
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener todos los Colegas.");
                return StatusCode(500, "Ocurrió un error interno. Inténtelo más tarde.");
            }
        }


        //Endpoint que verifica el Telefono
        [HttpGet("verificarTelefono")]
        public async Task<IActionResult> VerificarTelefono(string telefono)
        {
            var telefonoExistente = await _dbContext.Colegas.FirstOrDefaultAsync(p => p.telefono == telefono);
            if (telefonoExistente != null)
            {
                return Ok(new { existe = true });
            }
            return Ok(new { existe = false });
        }


        //Endpoint que verifica el Telefono para la actualizacion
        [HttpGet("verificarTelefonoActualizacion")]
        public async Task<IActionResult> verificarTelefonoActualizacion(string telefono, int colegaId)
        {
            // Verificar si el teléfono ya está en la base de datos, excluyendo el colega actual
            var telefonoExistente = await _dbContext.Colegas
                .Where(p => p.telefono == telefono && p.id_colega != colegaId) // Excluir al colega actual
                .FirstOrDefaultAsync();

            if (telefonoExistente != null)
            {
                return Ok(new { existe = true });
            }
            return Ok(new { existe = false });
        }

        //endpoint para la creacion de Colegas
        [HttpPost("crearColega")]
        public async Task<IActionResult> PostColega([FromBody] Colegas colegas)
        {
            try
            {
                if (colegas == null)
                {
                    return BadRequest(new { error = "El Contacto no puede ser nulo" });
                }

                await _dbContext.Colegas.AddAsync(colegas);
                await _dbContext.SaveChangesAsync();

                return Ok(new { message = "Contacto creado exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        //endpoint para actualizar los datos de los colegas
        [HttpPut("actualizar")]
        public async Task<IActionResult> ActualizarColega([FromBody] Colegas colegaActualizado)
        {
            if (colegaActualizado == null || colegaActualizado.id_colega == 0)
            {
                return BadRequest(new { mensaje = "Datos inválidos" });
            }

            try
            {
                var colegaExistente = await _dbContext.Colegas.FindAsync(colegaActualizado.id_colega);
                if (colegaExistente == null)
                {
                    return NotFound(new { mensaje = "Contacto no encontrado" });
                }

                // Actualizar los datos del paciente
                colegaExistente.nombres = colegaActualizado.nombres;
                colegaExistente.apellido = colegaActualizado.apellido;
                colegaExistente.telefono = colegaActualizado.telefono;
                colegaExistente.ubicacion = colegaActualizado.ubicacion;
                colegaExistente.email = colegaActualizado.email;
                colegaExistente.profesion = colegaActualizado.profesion;

                _dbContext.Colegas.Update(colegaExistente);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Contacto actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }


        [HttpDelete("eliminarContacto/{idEliminar}")]
        public async Task<IActionResult> eliminarContacto(int idEliminar)
        {

            try
            {
                var contactoEliminar = await _dbContext.Colegas.FindAsync(idEliminar);

                if (contactoEliminar == null)
                {
                    return NotFound(new { mensaje = "Contacto no encontrado" });
                }

                _dbContext.Colegas.Remove(contactoEliminar);
                await _dbContext.SaveChangesAsync();

                return Ok(new { mensaje = "Contacto eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error en el servidor", detalle = ex.Message });
            }
        }

    }
}
