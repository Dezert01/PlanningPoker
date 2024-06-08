using PlanningPoker.Models.UserStory;

namespace PlanningPoker.Models.Users
{
    public class UserHistory
    {
        public int RoomId { get; set; }
        public string RoomName { get; set; }
        public string RoomVotingSystem { get; set; }

        public IList<UserStoryDto> RoomUserStories { get; set; }
    }
}
