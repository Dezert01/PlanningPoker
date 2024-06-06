using System.Globalization;
using System.Text;
using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Models.UserStory;
using PlanningPoker.Persistence;

namespace PlanningPoker.Services.UserStoryService
{
    public class UserStoryService : IUserStoryService
    {
        private readonly PlanningPokerDbContext _dbContext;

        public UserStoryService(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> AddUserStory(UserStory userStory)
        {
            if (await _dbContext.UserStories.Where(us => us.RoomId == userStory.RoomId).AnyAsync(us => us.Title == userStory.Title))
                return false;

            try
            {
                await _dbContext.UserStories.AddAsync(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateUserStory(int roomId, int userStoryId, string name, string description)
        {
            try
            {
                var userStory =
                    await _dbContext.UserStories.FirstOrDefaultAsync(us => us.Id == userStoryId && us.RoomId == roomId);

                if (userStory == null)
                    throw new Exception("No User Story with given ID");

                userStory.Title = name;
                userStory.Description = description;

                _dbContext.Update(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> DeleteUserStory(int roomId, int userStoryId)
        {
            try
            {
                var userStory =
                    await _dbContext.UserStories.FirstOrDefaultAsync(us => us.Id == userStoryId && us.RoomId == roomId);

                if (userStory == null)
                    throw new Exception("No User Story with given ID");

                _dbContext.UserStories.Remove(userStory);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task DeleteRoomUserStories(int roomId)
        {
            var userStories =
                await _dbContext.UserStories
                    .Include(us => us.Tasks)
                    .Where(us => us.RoomId == roomId)
                    .ToListAsync();

            if (!userStories.Any())
                return;

            foreach (var userStory in userStories)
            {
                _dbContext.UserStoryTasks.RemoveRange(userStory.Tasks);
            }

            _dbContext.UserStories.RemoveRange(userStories);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IList<UserStoryDto>> ListUserStories(int roomId)
        {
            var userStories = await _dbContext.UserStories
                .Include(us => us.Tasks)
                .Where(us => us.RoomId == roomId).ToListAsync();

            var userStoryListItems = userStories.Select(us => new UserStoryDto
            {
                Id = us.Id,
                Title = us.Title,
                Description = us.Description,
                Tasks = UserStoryTaskDto(us.Tasks)
            }).ToList();

            return userStoryListItems;
        }

        public async Task<UserStoryDto?> GetUserStoryDetails(int userStoryId)
        {
            var userStory =
                await _dbContext.UserStories
                    .Include(us => us.Tasks)
                    .FirstOrDefaultAsync(us => us.Id == userStoryId);

            if (userStory == null)
                return null;

            var userStoryDto = new UserStoryDto
            {
                Id = userStory.Id,
                Title = userStory.Title,
                Description = userStory.Description
            };
            
            userStoryDto.Tasks = UserStoryTaskDto(userStory.Tasks);
            
            return userStoryDto;
        }
        private IList<UserStoryTaskDto> UserStoryTaskDto(IList<UserStoryTask> tasks)
        {
            var tasksDto = new List<UserStoryTaskDto>();

            foreach (var task in tasks)
            {
                tasksDto.Add(new UserStoryTaskDto
                {
                    Id = task.Id,
                    Title = task.Title,
                    Description = task.Description,
                    EstimationResult = task.EstimationResult
                });
            }

            return tasksDto;
        }

        public async Task<bool> CreateUserStoryTask(UserStoryTask task)
        {
            var tasks = await _dbContext.UserStoryTasks.ToListAsync();

            if (tasks.Any(t => t.Title == task.Title))
                return false;

            try
            {
                await _dbContext.UserStoryTasks.AddAsync(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return false;
            }
        }

        public async Task<bool> UpdateUserStoryTask(int userStoryTaskId, string title, string description)
        {
            var task = await _dbContext.UserStoryTasks.FirstOrDefaultAsync(t => t.Id == userStoryTaskId);

            if (task == null)
                return false;
            
            try
            {
                _dbContext.UserStoryTasks.Update(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                
                return false;
            }
        }

        public async Task<bool> DeleteUserStoryTask(int userStoryTaskId)
        {
            var task = await _dbContext.UserStoryTasks.FirstOrDefaultAsync(t => t.Id == userStoryTaskId);

            if (task == null)
                return false;

            try
            {
                _dbContext.UserStoryTasks.Remove(task);
                await _dbContext.SaveChangesAsync();

                return true;
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);

                return false;
            }
        }

        public async Task<MemoryStream?> ExportUserStories(int roomId)
        {
            var userStories = await GetUserStories(roomId);

            if (!userStories.Any())
                return null;
            
            var memoryStream = new MemoryStream();
            var streamWriter = new StreamWriter(memoryStream, Encoding.UTF8);

            await streamWriter.WriteLineAsync("Title,Description,Tasks");

            foreach (var userStory in userStories)
            {
                var tasksCsv = string.Join("|", userStory.Tasks.Select(t => t.ToCsvString()));
                await streamWriter.WriteLineAsync($"{userStory.Title},{userStory.Description},{tasksCsv}");
            }

            await streamWriter.FlushAsync();
            memoryStream.Seek(0, SeekOrigin.Begin);

            return memoryStream;
        }

        public async Task<bool> ImportUserStories(int roomId, IFormFile file)
        {
            try
            {
                using (var streamReader = new StreamReader(file.OpenReadStream(), Encoding.UTF8))
                {
                    await streamReader.ReadLineAsync();

                    while (!streamReader.EndOfStream)
                    {
                        var line = await streamReader.ReadLineAsync();

                        if (string.IsNullOrEmpty(line))
                            continue;

                        var parts = line.Split(',');

                        var title = parts[0];
                        var description = parts[1];

                        var newUserStory = new UserStory
                        {
                            Title = title,
                            Description = description,
                            RoomId = roomId
                        };

                        await AddUserStory(newUserStory);

                        if (string.IsNullOrWhiteSpace(parts[2]))
                            continue;

                        var tasks = parts[2].Split("|").ToList();

                        var userStoryTasks = tasks.Select(csvTask => new UserStoryTask(newUserStory.Id, csvTask)).ToList();
                        await _dbContext.UserStoryTasks.AddRangeAsync(userStoryTasks);

                    }
                }

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                
                return false;
            }
        }

        private async Task<IList<UserStory>> GetUserStories(int roomId)
        {
            return await _dbContext.UserStories
                .Include(us => us.Tasks)
                .Where(us => us.RoomId == roomId)
                .ToListAsync();
        }

        public async Task<UserStoryTask?> GetUserStoryTaskById(int userStoryTaskId)
        {
            return await _dbContext.UserStoryTasks.FindAsync(userStoryTaskId);
        }

        public async Task<string> EstimateTaskValue(int userStoryTaskId, IList<VotingResults> votingResults, VotingSystem votingSystem)
        {
            var estimation = EvaluateResults(votingResults, votingSystem);

            var task = await GetUserStoryTaskById(userStoryTaskId);

            if (task == null)
                return string.Empty;

            task.EstimationResult = estimation;

            _dbContext.UserStoryTasks.Update(task);
            await _dbContext.SaveChangesAsync();

            return task.EstimationResult;
        }

        private string EvaluateResults(IList<VotingResults> results, VotingSystem votingSystem)
        {
            var count = results.Count;

            if (votingSystem == VotingSystem.Fibonacci)
            {
                var sum = results.Select(r => int.Parse(r.Value)).Sum();
                var avg = (double)sum/count;

                var estimation = Math.Round(avg, MidpointRounding.AwayFromZero);

                return estimation.ToString(CultureInfo.InvariantCulture);
            }

            if (votingSystem == VotingSystem.Tshirts)
            {
                var mapper = new TshirtSizeMapper();

                var sum = results.Select(r => mapper.MapFromTshirtSize(r.Value)).Sum();

                var avg = (double)sum / count;
                var estimation = Math.Round(avg, MidpointRounding.AwayFromZero);

                return mapper.MapToTshirtSize((int)estimation);
            }

            return string.Empty;
        }

    }
}
