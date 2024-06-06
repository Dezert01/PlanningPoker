namespace PlanningPoker.Models.Auth.SignUp
{
    public class SignUpResult
    {
        public bool Status { get; set; }
        public string? Message { get; set; }
        public int? UserId { get; set; }

        public SignUpResult Success(int id)
        {
            Status = true;
            Message = "Sign up successful";
            UserId = id;

            return this;
        }

        public SignUpResult UsernameTaken(string username)
        {
            Status = false;
            Message = $"Username \"{username}\" is taken";
            UserId = null;

            return this;
        }

        public SignUpResult EmailAlreadyInUse(string email)
        {
            Status = false;
            Message = $"E-mail \"{email}\" already in use";
            UserId = null;

            return this;
        }

        public SignUpResult Failure(Exception error)
        {
            Status = false;
            Message = error.Message;
            UserId = null;

            return this;
        }
    }
}
