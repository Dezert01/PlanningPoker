using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Auth.SignIn;
using PlanningPoker.Models.Auth.SignUp;
using PlanningPoker.Models.Users;
using PlanningPoker.Models.UserStory;
using PlanningPoker.Persistence;

namespace PlanningPoker.Services.UserService
{
    public class UserService : IUserService
    {
        private readonly PlanningPokerDbContext _dbContext;
        public UserService(PlanningPokerDbContext dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<SignUpResult> CreateUser(SignUpRequest request)
        {
            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                Password = request.Password
            };

            var result = new SignUpResult();

            try
            {
                var users = await _dbContext.Users.ToListAsync();

                if (users.Any(u => CompareStrings(u.Username, request.Username)))
                    return result.UsernameTaken(request.Username);

                if (users.Any(u => CompareStrings(u.Email, request.Email)))
                    return result.EmailAlreadyInUse(request.Email);

                await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();

                return result.Success(user.Id);
            }
            catch (Exception ex)
            {
                return result.Failure(ex);
            }

        }

        private bool CompareStrings(string a, string b)
        {
            return string.Equals(a, b, StringComparison.InvariantCultureIgnoreCase);
        }

        public async Task<SignInResult> GetUserId(SignInRequest request)
        {
            var result = new SignInResult();

            try
            {
                var users = await _dbContext.Users.ToListAsync();
                var user = users.FirstOrDefault(u => u.Email == request.Email);

                if (user == null)
                    return result.WrongEmail();

                return user.Password != request.Password ? result.WrongPassword() : result.Success(user);
            }
            catch (Exception ex)
            {
                return result.Failure(ex);
            }

        }

        public async Task<User?> GetUser(int userId)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

            return user;
        }

        public async Task<string> GetUsername(int? userId)
        {
            if (userId == null)
            {
                var randomId = Guid.NewGuid().ToString().Substring(0, 4).ToUpper();

                return $"Guest#{randomId}";
            }

            var user = await GetUser(userId.Value);

            return user == null ? string.Empty : user.Username;
        }

        public async Task<IList<UserHistory>> GetUserHistory(int userId)
        {
            var userHistories = new List<UserHistory>();

            var tasks = await _dbContext.UserStoryTasks
                .Where(t => t.VotersIds.Contains(userId))
                .ToListAsync();

            if (tasks.Count == 0)
                return userHistories;

            var userStoryIds = tasks.Select(t => t.UserStoryId).Distinct().ToList();

            var userStories = await _dbContext.UserStories
                .Where(us => userStoryIds.Contains(us.Id))
                .ToListAsync();

            var roomIds = userStories.Select(us => us.RoomId).Distinct().ToList();

            var rooms = await _dbContext.Rooms
                .Where(r => roomIds.Contains(r.Id))
                .ToListAsync();

            var userStoriesByRoom = userStories.GroupBy(us => us.RoomId);

            foreach (var roomGroup in userStoriesByRoom)
            {
                var room = rooms.First(r => r.Id == roomGroup.Key);
                var userStoryHistories = new List<UserStoryDto>();

                foreach (var userStory in roomGroup)
                {
                    var tasksInStory = tasks.Where(t => t.UserStoryId == userStory.Id).ToList();
                    var taskHistories = tasksInStory.Select(task => new UserStoryTaskDto
                    {
                        Id = task.Id,
                        Title = task.Title,
                        Description = task.Description,
                        EstimationResult = task.EstimationResult
                    }).ToList();

                    userStoryHistories.Add(new UserStoryDto
                    {
                        Id = userStory.Id,
                        Title = userStory.Title,
                        Description = userStory.Description,
                        Tasks = taskHistories
                    });
                }

                userHistories.Add(new UserHistory
                {
                    RoomId = room.Id,
                    RoomName = room.Name,
                    RoomVotingSystem = room.VotingSystem.ToString(),
                    RoomUserStories = userStoryHistories
                });
            }

            return userHistories;
        }

    }
}
