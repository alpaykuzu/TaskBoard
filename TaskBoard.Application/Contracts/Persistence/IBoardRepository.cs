using System.Collections.Generic;
using System.Threading.Tasks;
using TaskBoard.Domain.Entities;

namespace TaskBoard.Application.Contracts.Persistence
{
    public interface IBoardRepository
    {
        Task<IReadOnlyList<Board>> GetBoardsByUserIdAsync(string userId);
        Task<Board> GetBoardWithDetailsAsync(int boardId);
        Task<Board> GetByIdAsync(int id); 
        Task<Board> AddAsync(Board board);
    }
}
