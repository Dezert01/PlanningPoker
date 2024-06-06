using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Auth.SignIn;
using PlanningPoker.Models.Auth.SignUp;
using PlanningPoker.Models.Users;
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
    }
}
