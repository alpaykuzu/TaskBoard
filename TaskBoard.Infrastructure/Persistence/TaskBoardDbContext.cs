using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Infrastructure.Persistence
{
    public class TaskBoardDbContext : IdentityDbContext<AppUser>
    {
        public TaskBoardDbContext(DbContextOptions<TaskBoardDbContext> options) : base(options)
        {
        }

        public DbSet<Board> Boards { get; set; }
        public DbSet<TaskList> TaskLists { get; set; }
        public DbSet<TaskCard> TaskCards { get; set; }
    }
}
