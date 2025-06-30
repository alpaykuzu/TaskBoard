using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Persistence;

namespace TaskBoard.Infrastructure.Repositories
{
    public class BoardRepository : IBoardRepository
    {
        private readonly TaskBoardDbContext _context;

        public BoardRepository(TaskBoardDbContext context)
        {
            _context = context;
        }

        public async Task<Board> AddAsync(Board board)
        {
            await _context.Boards.AddAsync(board);
            await _context.SaveChangesAsync();
            return board;
        }

        public async Task<IReadOnlyList<Board>> GetBoardsByUserIdAsync(string userId)
        {
            return await _context.Boards
                                 .Where(b => b.AppUserId == userId)
                                 .ToListAsync();
        }

        public async Task<Board> GetBoardWithDetailsAsync(int boardId)
        {
            return await _context.Boards
                                 .Include(b => b.TaskLists)
                                 .ThenInclude(tl => tl.TaskCards)
                                    .ThenInclude(tc => tc.Labels) 
                                 .FirstOrDefaultAsync(b => b.Id == boardId);
        }

 
        public async Task<Board> GetByIdAsync(int id)
        {
            return await _context.Boards.FindAsync(id);
        }
    }
}
