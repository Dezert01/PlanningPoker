using PlanningPoker.Models.Auth.SignIn;
using PlanningPoker.Models.Auth.SignUp;
using PlanningPoker.Models.Users;

namespace PlanningPoker.Services.UserService
{
    public interface IUserService
    {
        Task<SignUpResult> CreateUser(SignUpRequest request);
        Task<SignInResult> GetUserId(SignInRequest request);
        Task<User?> GetUser(int userId);
        Task<string> GetUsername(int? userId);
        Task<IList<UserHistory>> GetUserHistory(int userId);
    }
}
