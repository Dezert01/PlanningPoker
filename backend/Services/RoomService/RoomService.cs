using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Persistence;
using PlanningPoker.Services.ParticipantService;
using PlanningPoker.Services.UserStoryService;

namespace PlanningPoker.Services.RoomService
{
    public class RoomService : IRoomService
    {
        private readonly PlanningPokerDbContext _dbContext;
        private readonly IUserStoryService _userStoryService;
        private readonly IParticipantService _participantService;

        public RoomService(
            PlanningPokerDbContext dbContext,
            IUserStoryService userStoryService,
            IParticipantService participantService)
        {
            _dbContext = dbContext;
            _userStoryService = userStoryService;
            _participantService = participantService;
        }

        public async Task<IEnumerable<Room>> GetAll()
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .ToListAsync();
        }

        public async Task<Room?> GetRoomById(int id)
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<Room?> GetByConnectionId(string connectionId)
        {
            return await _dbContext.Rooms
                .Include(r => r.Participants)
                .FirstOrDefaultAsync(r => r.Participants.Any(p => p.ConnectionId == connectionId));
        }

        public async Task<bool> Delete(int id)
        {
            var room = await _dbContext.Rooms
                .Include(r => r.Participants)
                .Include(r => r.UserStories)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
                return false;

            var participants = room.Participants;

            if (participants.Any())
                _dbContext.Participants.RemoveRange(participants);

            if (room.UserStories.Any())
                await _userStoryService.DeleteRoomUserStories(room.Id);

            _dbContext.Rooms.Remove(room);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<int> Create(NewRoom newRoom)
        {

            var room = new Room
            {
                Name = newRoom.Name,
                Capacity = newRoom.Capacity,
                CreatedAt = DateTime.UtcNow,
                VotingSystem = newRoom.VotingSystem
            };

            await _dbContext.Rooms.AddAsync(room);
            await _dbContext.SaveChangesAsync();
            return room.Id;
        }

        public async Task<bool> Join(Room room, string participantName, string connectionId, int? userId)
        {
            var existingParticipant = room.Participants.FirstOrDefault(p => p.Name == participantName);

            if (existingParticipant == null)
                await _participantService.CreateParticipant(room.Id, participantName, connectionId, userId, room.Participants.Count == 0);
            else    
                await _participantService.UpdateParticipant(existingParticipant, connectionId);

            return true;
        }

        public async Task<bool> HaveAllActiveParticipantsVoted(int roomId)
        {
            var room = await GetRoomById(roomId);

            if (room == null)
                return false;

            return room.Participants.All(p => p.Vote != null);
        }

        public IList<VotingState> GetVotingState(Room room)
        {
            return room.Participants.OrderBy(p => p.Id).Select(participant => (new VotingState(participant.Name, participant.Vote != null))).ToList();
        }

        public IList<VotingResults> GetVotingResults(Room room)
        {
            return room.Participants.OrderBy(p => p.Id).Select(participant => new VotingResults(participant.Name, participant.Vote!)).ToList();
        }

        public async Task SetGameState(int roomId, RoomGameState gameState)
        {
            var room = await GetRoomById(roomId);

            if (room == null)
                throw new Exception("Room not found.");

            room.GameState = gameState;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<RoomGameState> GetGameState(int roomId)
        {
            var room = await GetRoomById(roomId);

            if (room == null)
                throw new Exception("Room not found.");

            return room.GameState;
        }
    }
}
