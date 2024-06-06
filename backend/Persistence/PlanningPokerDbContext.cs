using Microsoft.EntityFrameworkCore;
using PlanningPoker.Models.Participants;
using PlanningPoker.Models.Rooms;
using PlanningPoker.Models.Users;
using PlanningPoker.Models.UserStory;

namespace PlanningPoker.Persistence
{

    public class PlanningPokerDbContext : DbContext
    {
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserStory> UserStories { get; set; }
        public DbSet<UserStoryTask> UserStoryTasks { get; set; }

        public PlanningPokerDbContext(DbContextOptions<PlanningPokerDbContext> options):
            base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseIdentityColumns();

            modelBuilder.Entity<Room>()
                .Property(r => r.VotingSystem)
                .HasConversion<string>();

            modelBuilder.Entity<Room>()
                .HasMany(r => r.Participants)
                .WithOne()
                .HasForeignKey(p => p.RoomId);

            modelBuilder.Entity<Room>()
                .HasMany(r => r.UserStories)
                .WithOne()
                .HasForeignKey(us => us.RoomId);

            modelBuilder.Entity<Participant>()
                .Property(p => p.Role)
                .HasConversion<string>();

            modelBuilder.Entity<UserStory>()
                .HasMany(us => us.Tasks)
                .WithOne()
                .HasForeignKey(t => t.UserStoryId);

            base.OnModelCreating(modelBuilder);
        }
    }

}
