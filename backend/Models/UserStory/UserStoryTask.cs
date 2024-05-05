﻿namespace PlanningPoker.Models.UserStory
{
    public class UserStoryTask
    {
        public UserStoryTask(int userStoryId, string title, string description)
        {
            UserStoryId = userStoryId;
            Title = title;
            Description = description;
            EstimationResult = string.Empty;
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string EstimationResult { get; set; }
        public int UserStoryId { get; set; }
    }
}
