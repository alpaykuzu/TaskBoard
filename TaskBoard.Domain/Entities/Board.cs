using System.Collections.Generic;

namespace TaskBoard.Domain.Entities
{
    public class Board
    {
        public int Id { get; set; }
        public string Title { get; set; }

        // Foreign Key: Bu panonun hangi kullanıcıya ait olduğu.
        public string AppUserId { get; set; }

        // Navigation Property: Kullanıcı nesnesine erişim için.
        public AppUser AppUser { get; set; }

        // Navigation Property: Bir panonun içinde birden çok görev sütunu olabilir.
        public ICollection<TaskList> TaskLists { get; set; } = new List<TaskList>();
    }
}