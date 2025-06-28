using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Application.Contracts.Persistence
{
    public interface ITaskCardRepository
    {
        Task<IReadOnlyList<TaskCard>> GetAllAsync();
        Task<TaskCard> GetByIdAsync(int id);
        Task<TaskCard> GetByIdWithParentAsync(int id);
        Task<TaskCard> AddAsync(TaskCard taskCard);
        Task DeleteAsync(TaskCard taskCard);
        Task UpdateAsync(TaskCard taskCard);
    }
}
