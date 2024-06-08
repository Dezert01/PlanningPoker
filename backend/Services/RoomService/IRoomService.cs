using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;

namespace PlanningPoker.Services.RoomService
{
    public interface IRoomService
    {
        Task<IEnumerable<Room>> GetAll();
        Task<Room?> GetRoomById(int id);
        Task<Room?> GetByConnectionId(string connectionId);
        Task<int> Create(NewRoom room);
        Task<bool> Delete(int id);

        Task<bool> Join(Room room, string participantName, string connectionId, int? userId);
        Task<bool> HaveAllActiveParticipantsVoted(int roomId);

        IList<VotingState> GetVotingState(Room room);
        IList<VotingResults> GetVotingResults(Room room);

        Task SetGameState(int roomId, RoomGameState gameState);
        Task<RoomGameState> GetGameState(int roomId);
    }
}
