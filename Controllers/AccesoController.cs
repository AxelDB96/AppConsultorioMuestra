using Microsoft.AspNetCore.Mvc;
using WebAppConsultorio.Models;
using WebAppConsultorio.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Numerics;

namespace WebAppConsultorio.Controllers
{
    public class AccesoController : Controller
    {
        private readonly AppDBContext _dbContext;

        public AccesoController(AppDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity!.IsAuthenticated) return RedirectToAction("Index", "Home");
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(Login login)
        {
            try
            {
                //  Se retiro la validacion de usuario y contraseña para poder ingresar

                List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, "Usuario Genérico")
        };

                ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

                AuthenticationProperties properties = new AuthenticationProperties()
                {
                    AllowRefresh = true,
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    properties
                );

                return RedirectToAction("Index", "Home");
            }
            catch (Exception ex)
            {
                ViewData["Mensaje"] = $"Ocurrió un error: {ex.Message}";
                return View();
            }
        }
    }
}
