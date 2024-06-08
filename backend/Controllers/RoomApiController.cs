using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Services.RoomService;

namespace PlanningPoker.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomApiController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomApiController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _roomService.GetAll();

            var result = rooms.Select(r => new RoomDto
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
                CreatedAt = r.CreatedAt,
                Owner = r.Participants.FirstOrDefault(p => p.Role == ParticipantRole.Owner),
                Occupancy = r.Participants.Count,
                VotingSystem = r.VotingSystem.ToString().ToUpper(),
                GameState = r.GameState.ToString()
            });

            return Ok(result);
        }

        [HttpGet("{roomId}")]
        public async Task<IActionResult> Get([FromRoute] int roomId)
        {
            var room = await _roomService.GetRoomById(roomId);

            if (room == null)
                return NotFound("Room with given id was not found");

            var result = new RoomDto
            {
                Id = room.Id,
                Name = room.Name,
                Capacity = room.Capacity,
                CreatedAt = room.CreatedAt,
                Occupancy = room.Participants.Count,
                VotingSystem = room.VotingSystem.ToString().ToUpper(),
                GameState = room.GameState.ToString()
            };

            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] NewRoom room)
        {
            if (room == null)
                return BadRequest("Invalid room object");

            try
            {
                var result = await _roomService.Create(room);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while processing the request. { ex.Message }");
            }

        }

        [HttpDelete("delete/{roomId}")]
        public async Task<IActionResult> Delete([FromRoute] int roomId)
        {
            var result = await _roomService.Delete(roomId);
            return Ok(result);
        }

        [HttpGet("participants/{roomId}")]
        public async Task<IActionResult> GetParticipants([FromRoute] int roomId)
        {
            var room = await _roomService.GetRoomById(roomId);
            if (room == null)
                return NotFound($"Room { roomId } was not found");

            var result = room.Participants;
            return Ok(result);
        }

        [HttpGet("{roomId}/voting-state")]
        public async Task<IActionResult> GetVotingState([FromRoute] int roomId)
        {
            var room = await _roomService.GetRoomById(roomId);
            
            if (room == null)
                return NotFound($"Room { roomId } was not found");
            
            var result = _roomService.GetVotingState(room);

            return Ok(result);
        }
    }
}
