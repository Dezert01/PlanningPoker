using PlanningPoker.Models.Participants;
using System.Text.Json.Serialization;

namespace PlanningPoker.Models.Rooms
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public Participant? Owner { get; set; }
        public int Occupancy { get; set; }

        //[JsonConverter(typeof(JsonStringEnumConverter))]
        public string VotingSystem { get; set; } // todo: enum
        public string GameState { get; set; }
    }
}
