using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Services.UserStoryService;

namespace PlanningPoker.Controllers
{
    [Route("api/user-stories")]
    [ApiController]
    public class UserStoryApiController : ControllerBase
    {
        private readonly IUserStoryService _userStoryService;

        public UserStoryApiController(IUserStoryService userStoryService)
        {
            _userStoryService = userStoryService;
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> ListUserStories([FromRoute] int roomId)
        {
            var userStoryList = await _userStoryService.ListUserStories(roomId);

            return Ok(userStoryList);
        }

        [HttpGet("/details/{userStoryId}")]
        public async Task<IActionResult> GetUserStoryDetails([FromRoute] int userStoryId)
        {
            var userStory = await _userStoryService.GetUserStoryDetails(userStoryId);

            if (userStory == null)
                return NotFound();

            return Ok(userStory);
        }

        [HttpGet("export/{roomId}")]
        public async Task<IActionResult> ExportUserStories([FromRoute] int roomId)
        {
            var memoryStream = await _userStoryService.ExportUserStories(roomId);

            if (memoryStream == null)
                return BadRequest("No user stories in that room");

            var fileName = $"user_stories_{roomId}.csv";

            return File(memoryStream, "text/csv", fileName);
        }

        [HttpPost("import/{roomId}")]
        public async Task<IActionResult> ImportUserStories([FromRoute] int roomId, [FromForm] IFormFile file)
        {
            if (file.Length == 0)
                return BadRequest("File empty");

            var success = await _userStoryService.ImportUserStories(roomId, file);

            if (!success)
                return BadRequest("Importing user stories failed");
            
            return Ok("Import successful");
        }
    }
}
