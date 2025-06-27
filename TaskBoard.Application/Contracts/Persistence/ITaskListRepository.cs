using TaskBoard.Domain.Entities;

namespace TaskBoard.Application.Contracts.Persistence
{
    public interface ITaskListRepository
    {
        Task<IReadOnlyList<TaskList>> GetAllWithCardsAsync();
        Task<TaskList> AddAsync(TaskList taskList);
        Task<TaskList> GetByIdAsync(int id);
    }
}