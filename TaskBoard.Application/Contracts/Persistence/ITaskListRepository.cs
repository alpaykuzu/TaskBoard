using System.Collections.Generic;
using System.Threading.Tasks;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Application.Contracts.Persistence
{
    public interface ITaskListRepository
    {
        Task<IReadOnlyList<TaskList>> GetAllWithCardsAsync();
        Task<TaskList> GetByIdAsync(int id);
        Task<TaskList> AddAsync(TaskList taskList);
        Task UpdateAsync(TaskList taskList);
        Task DeleteAsync(TaskList taskList);
    }
}
