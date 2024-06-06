using PlanningPoker.Models.Users;

namespace PlanningPoker.Models.Auth.SignIn
{
    public class SignInResult
    {
        public bool Status { get; set; }
        public string? Message { get; set; }
        public int? UserId { get; set; }

        public SignInResult WrongEmail()
        {
            Status = false;
            Message = "Wrong e-mail";
            UserId = null;

            return this;
        }

        public SignInResult WrongPassword()
        {
            Status = false;
            Message = "Wrong password";
            UserId = null;

            return this;
        }

        public SignInResult Success(User user)
        {
            Status = true;
            Message = "Sign in successful";
            UserId = user.Id;

            return this;
        }

        public SignInResult Failure(Exception error)
        {
            Status = false;
            Message = error.Message;
            UserId = null;

            return this;
        }
    }
}
