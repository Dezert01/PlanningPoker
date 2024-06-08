using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Participants;
using PlanningPoker.Persistence;

namespace PlanningPoker.Services.ParticipantService
{
    public class ParticipantService : IParticipantService
    {
        private readonly PlanningPokerDbContext _dbContext;

        public ParticipantService(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SubmitVote(string participantName, string connectionId, string voteValue)
        {
            var participant = await _dbContext.Participants
                .Where(p => p.ConnectionId == connectionId)
                .FirstOrDefaultAsync(p => p.Name == participantName);

            if (participant == null)
                throw new Exception("Participant not found");

            participant.Vote = voteValue;
            await _dbContext.SaveChangesAsync();
        }

        public async Task<Participant?> GetParticipantByConnectionId(string connectionId)
        {
            return await _dbContext.Participants.FirstOrDefaultAsync(p => p.ConnectionId == connectionId);
        }

        public async Task LeaveRoom(Participant participant)
        {
            _dbContext.Remove(participant);
            await _dbContext.SaveChangesAsync();
        }

        public async Task CreateParticipant(int roomId, string participantName, string connectionId, int? userId, bool isOwner)
        {
            var participant = new Participant(roomId, participantName, connectionId, userId, isOwner);
            await _dbContext.Participants.AddAsync(participant);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateParticipant(Participant existingParticipant, string connectionId)
        {
            existingParticipant.ConnectionId = connectionId;
            existingParticipant.Vote = null;

            _dbContext.Update(existingParticipant);
            await _dbContext.SaveChangesAsync();
        }
    }
}
