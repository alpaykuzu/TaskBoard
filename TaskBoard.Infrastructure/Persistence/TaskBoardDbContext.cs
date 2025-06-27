using Microsoft.EntityFrameworkCore;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Infrastructure.Persistence
{
    public class TaskBoardDbContext : DbContext
    {
        public TaskBoardDbContext(DbContextOptions<TaskBoardDbContext> options) : base(options) 
        {
        }

        public DbSet<TaskCard> TaskCards { get; set; } 
    }
}
