using System.Collections.Generic;

namespace TaskBoard.Domain.Entities
{
    public class Label
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Color { get; set; } 

        // Her etiket belirli bir panoya aittir.
        public int BoardId { get; set; }
        public Board Board { get; set; }

        // Navigation Property: Bir etiketin kullanıldığı tüm kartlar.
        public ICollection<TaskCard> TaskCards { get; set; } = new List<TaskCard>();
    }
}
