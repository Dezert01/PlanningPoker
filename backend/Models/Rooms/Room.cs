using PlanningPoker.Models.Participants;
using System.Text.Json.Serialization;

namespace PlanningPoker.Models.Rooms
{
    public class Room
    {
        public Room()
        {
            Participants = new List<Participant>();
            UserStories = new List<UserStory.UserStory>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int Capacity { get; set; }
        public DateTime CreatedAt { get; set; }
        public IList<Participant> Participants { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public VotingSystem VotingSystem { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public RoomGameState GameState { get; set; }

        public IList<UserStory.UserStory> UserStories { get; set; }

    }
}
