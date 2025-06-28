using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskBoard.Domain.Entities
{
    public class TaskList
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int Order { get; set; } 
        public ICollection<TaskCard> TaskCards { get; set; } = new List<TaskCard>();
        public int BoardId { get; set; }
        public Board Board { get; set; }
    }
}
