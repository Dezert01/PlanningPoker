using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models.Users;
using PlanningPoker.Services.UserService;

namespace PlanningPoker.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserApiController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserApiController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetCurrentUser([FromRoute] int userId)
        {
            var user = await _userService.GetUser(userId);

            if (user == null)
                return BadRequest("User does not exist");

            var userInfo = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username
            };

            return Ok(userInfo);
        }

        [HttpGet("{userId}/history")]
        public async Task<IActionResult> GetUserHistory([FromRoute] int userId)
        {
            if (userId == null)
                return Empty;

            var history = await _userService.GetUserHistory(userId);

            if (history.Count == 0)
                return NoContent();

            return Ok(history);
        }

    }
}
