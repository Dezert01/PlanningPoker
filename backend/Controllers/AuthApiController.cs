using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models.Auth.SignIn;
using PlanningPoker.Models.Auth.SignUp;
using PlanningPoker.Services.UserService;

namespace PlanningPoker.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthApiController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthApiController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUpRequest request)
        {
            var result = await _userService.CreateUser(request);

            return Ok(result);
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            var result = await _userService.GetUserId(request);

            return Ok(result);
        }

        
    }
}
