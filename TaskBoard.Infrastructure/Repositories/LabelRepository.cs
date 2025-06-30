using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Persistence;

namespace TaskBoard.Infrastructure.Repositories
{
    public class LabelRepository : ILabelRepository
    {
        private readonly TaskBoardDbContext _context;

        public LabelRepository(TaskBoardDbContext context)
        {
            _context = context;
        }

        public async Task<Label> GetByIdAsync(int id)
        {
            return await _context.Labels.FindAsync(id);
        }

        public async Task<Label> AddAsync(Label label)
        {
            await _context.Labels.AddAsync(label);
            await _context.SaveChangesAsync();
            return label;
        }

        public async Task<IReadOnlyList<Label>> GetLabelsByBoardIdAsync(int boardId)
        {
            return await _context.Labels
                                 .Where(l => l.BoardId == boardId)
                                 .ToListAsync();
        }
    }
}
