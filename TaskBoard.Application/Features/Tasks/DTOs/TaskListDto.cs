using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskBoard.Application.Features.Tasks.DTOs
{
    public class TaskListDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int Order { get; set; }
        public List<TaskCardDto> TaskCards { get; set; } // İçindeki kartlar
    }
}
