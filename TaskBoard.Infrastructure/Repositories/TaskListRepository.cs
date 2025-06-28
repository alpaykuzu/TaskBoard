using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Persistence;

namespace TaskBoard.Infrastructure.Repositories
{
    public class TaskListRepository : ITaskListRepository
    {
        private readonly TaskBoardDbContext _context;

        public TaskListRepository(TaskBoardDbContext context)
        {
            _context = context;
        }

        public async Task<TaskList> AddAsync(TaskList taskList)
        {
            await _context.TaskLists.AddAsync(taskList);
            await _context.SaveChangesAsync();
            return taskList;
        }

        public async Task<IReadOnlyList<TaskList>> GetAllWithCardsAsync()
        {
            return await _context.TaskLists
                                 .Include(tl => tl.TaskCards)
                                 .OrderBy(tl => tl.Order)
                                 .ToListAsync();
        }

        public async Task<TaskList> GetByIdAsync(int id)
        {
            return await _context.TaskLists.FindAsync(id);
        }

        public async Task UpdateAsync(TaskList taskList)
        {
            _context.Entry(taskList).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(TaskList taskList)
        {
            _context.TaskLists.Remove(taskList);
            await _context.SaveChangesAsync();
        }
    }
}
