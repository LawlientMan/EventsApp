using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(i => i.Photos)
                .FirstOrDefaultAsync(i => i.Email == loginDto.Email);
            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (result)
            {
                return ConvertToUserDto(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(i => string.Equals(i.UserName, registerDto.UserName)))
            {
                ModelState.AddModelError(nameof(registerDto.UserName), "Username is already taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(i => string.Equals(i.Email, registerDto.Email)))
            {
                ModelState.AddModelError(nameof(registerDto.Email), "Email is already taken");
                return ValidationProblem();
            }

            var user = new AppUser()
            {
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.UserName,
                Email = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
            {
                return ConvertToUserDto(user);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(i => i.Photos)
                .FirstOrDefaultAsync(i => i.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user != null)
            {
                return ConvertToUserDto(user);
            }

            return null;
        }

        private ActionResult<UserDto> ConvertToUserDto(AppUser user)
        {
            return new UserDto()
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(i => i.IsMain)?.Url,
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
        }
    }
}