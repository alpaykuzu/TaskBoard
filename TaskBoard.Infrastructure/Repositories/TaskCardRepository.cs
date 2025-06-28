using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Persistence;

namespace TaskBoard.Infrastructure.Repositories
{
    public class TaskCardRepository : ITaskCardRepository
    {
        public readonly TaskBoardDbContext _context;
        public TaskCardRepository(TaskBoardDbContext context) 
        {
            _context = context;
        }

        public async Task<TaskCard> AddAsync(TaskCard taskCard)
        {
            await _context.TaskCards.AddAsync(taskCard);
            await _context.SaveChangesAsync();
            return taskCard;
        }
        public async Task<TaskCard> GetByIdWithParentAsync(int id)
        {
            // TaskCard'ı getirirken, ona bağlı olan TaskList nesnesini de getirmesini söylüyoruz.
            return await _context.TaskCards
                                 .Include(c => c.TaskList)
                                 .FirstOrDefaultAsync(c => c.Id == id);
        }
        public async Task DeleteAsync(TaskCard taskCard)
        {
            _context.TaskCards.Remove(taskCard);
            await _context.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<TaskCard>> GetAllAsync()
        {
            return await _context.TaskCards.ToListAsync();
        }

        public async Task<TaskCard> GetByIdAsync(int id)
        {
            return await _context.TaskCards.FindAsync(id);
        }

        public async Task UpdateAsync(TaskCard taskCard)
        {
            // EF Core, bir nesneyi veritabanından çektiğinde onu 'takip etmeye' başlar.
            // Takip edilen bir nesnenin property'leri değiştirilip SaveChangesAsync çağrıldığında,
            // EF Core hangi alanların değiştiğini anlar ve otomatik olarak doğru UPDATE sorgusunu oluşturur.
            await _context.SaveChangesAsync();
        }
    }
}
