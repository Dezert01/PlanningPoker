using Microsoft.EntityFrameworkCore;
using PlanningPoker.Persistence;
using PlanningPoker.Services.ParticipantService;
using PlanningPoker.Services.RoomService;
using PlanningPoker.Services.UserStoryService;
using PlanningPoker.SignalR.Hubs;

namespace PlanningPoker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var myAllowSpecificOrigins = "_myAllowSpecificOrigins";
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy(name: myAllowSpecificOrigins,
                    policy =>
                    {
                        policy.WithOrigins("https://planningpokerinf1337.vercel.app")
                            .AllowAnyMethod()
                            .AllowAnyHeader()
                            .AllowCredentials();
                    });
            });

            // Add services to the container.
            builder.Services.AddScoped<IRoomService, RoomService>();
            builder.Services.AddScoped<IParticipantService, ParticipantService>();
            builder.Services.AddScoped<IUserStoryService, UserStoryService>();

            try
            {
                var connectionString = builder.Configuration.GetConnectionString("PlanningPokerDb");
                builder.Services.AddDbContext<PlanningPokerDbContext>(options =>
                    options.UseNpgsql(connectionString)
                );

                //using (var scope = builder.Services.BuildServiceProvider().CreateScope())
               //{
                    //var context = scope.ServiceProvider.GetRequiredService<PlanningPokerDbContext>();
                    //context.Database.OpenConnection(); // Attempt to open a connection
                    //Console.WriteLine("Successfully connected to PlanningPokerDb!");
               // }
            }
            catch (Exception ex)
            {
            // Handle connection error here (e.g., log the exception)
            Console.WriteLine("Error connecting to database:", ex.Message);
            }

            builder.Services.AddSignalR();
            builder.Services.AddTransient<RoomHub>();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors(myAllowSpecificOrigins);
            app.UseAuthorization();

            app.MapHub<RoomHub>("/roomHub");

            app.MapControllers();

            app.Run();
        }
    }
}
