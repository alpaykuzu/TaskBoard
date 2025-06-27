using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskBoard.Domain.Entities
{
    public class TaskCard
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        // Foreign Key: Bu kartın hangi TaskList'e ait olduğunun ID'si.
        public int TaskListId { get; set; }

        // Navigation Property: Bu kartın ait olduğu TaskList nesnesine kod içinden erişim sağlar.
        public TaskList TaskList { get; set; }
    }
}
