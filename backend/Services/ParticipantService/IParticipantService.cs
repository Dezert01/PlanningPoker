using PlanningPoker.Models.Participants;

namespace PlanningPoker.Services.ParticipantService
{
    public interface IParticipantService
    {
        Task SubmitVote(string participantName, string connectionId, string? voteValue);
        Task<Participant?> GetParticipantByConnectionId(string connectionId);
        Task LeaveRoom(Participant participant);
        Task CreateParticipant(int roomId, string participantName, string connectionId, int? userId, bool isOwner);
        Task UpdateParticipant(Participant existingParticipant, string connectionId);
    }
}
