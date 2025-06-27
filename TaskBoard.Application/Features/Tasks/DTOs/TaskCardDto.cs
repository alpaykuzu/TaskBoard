using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskBoard.Application.Features.Tasks.DTOs
{
    public class TaskCardDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
    }
}
