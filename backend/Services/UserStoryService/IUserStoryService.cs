using Microsoft.AspNetCore.Mvc;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Models.UserStory;

namespace PlanningPoker.Services.UserStoryService
{
    public interface IUserStoryService
    {
        Task<bool> AddUserStory(UserStory userStory);
        Task<bool> UpdateUserStory(int roomId, int userStoryId, string name, string description);
        Task<bool> DeleteUserStory(int roomId, int userStoryId);

        Task DeleteRoomUserStories(int roomId);

        Task<IList<UserStoryDto>> ListUserStories(int roomId);
        Task<UserStoryDto?> GetUserStoryDetails(int userStoryId);

        Task<bool> CreateUserStoryTask(UserStoryTask task);
        Task<bool> UpdateUserStoryTask(int userStoryTaskId, string title, string description);
        Task<bool> DeleteUserStoryTask(int userStoryTaskId);

        Task<MemoryStream?> ExportUserStories(int roomId);
        Task<bool> ImportUserStories(int roomId, IFormFile file);

        Task<string> EstimateTaskValue(int userStoryTaskId, IList<VotingResults> votingResults, VotingSystem votingSystem);
        Task<UserStoryTask?> GetUserStoryTaskById(int userStoryTaskId);

    }
}
