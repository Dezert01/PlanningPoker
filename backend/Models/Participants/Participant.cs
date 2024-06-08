using System.Text.Json.Serialization;

namespace PlanningPoker.Models.Participants
{
    public class Participant
    {
        public Participant()
        {

        }

        public Participant(int roomId, string name, string connectionId, int? userId, bool isOwner = false)
        {
            Name = name ?? "";
            Role = isOwner ? ParticipantRole.Owner : ParticipantRole.Base;
            // Status = ParticipantStatus.Active;
            ConnectionId = connectionId;
            RoomId = roomId;
            UserId = userId;
        }

        public int Id { get; set; }
        public string Name { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ParticipantRole Role { get; set; }
        public string? Vote { get; set; }
        public string ConnectionId { get; set; }
        public int RoomId { get; set; }
        public int? UserId { get; set; }
    }
}
