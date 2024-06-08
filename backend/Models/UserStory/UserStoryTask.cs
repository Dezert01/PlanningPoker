namespace PlanningPoker.Models.UserStory
{
    public class UserStoryTask
    {
        public UserStoryTask(int userStoryId, string title, string description)
        {
            UserStoryId = userStoryId;
            Title = title;
            Description = description;
            EstimationResult = string.Empty;
            VotersIds = new List<int>();
        }

        public UserStoryTask(int userStoryId, string csvTask)
        {
            var properties = csvTask.Split(":");

            UserStoryId = userStoryId;
            Title = properties[0];
            Description = properties[1];

            var estimationResult = properties[2];
            EstimationResult = string.IsNullOrWhiteSpace(estimationResult) ? string.Empty : estimationResult;
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string EstimationResult { get; set; }
        public int UserStoryId { get; set; }
        public IList<int> VotersIds { get; set; }

        public string ToCsvString()
        {
            return $"{Title}:{Description}:{EstimationResult}";
        }
    }
}
