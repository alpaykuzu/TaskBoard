using System.Collections.Generic;
using System.Threading.Tasks;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Application.Contracts.Persistence
{
    public interface ILabelRepository
    {
        Task<Label> GetByIdAsync(int id);
        Task<Label> AddAsync(Label label);
        Task<IReadOnlyList<Label>> GetLabelsByBoardIdAsync(int boardId);
    }
}