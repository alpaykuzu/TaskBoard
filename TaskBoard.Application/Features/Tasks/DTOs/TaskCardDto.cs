using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Application.Features.Labels.DTOs;

namespace TaskBoard.Application.Features.Tasks.DTOs
{
    public class TaskCardDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public ICollection<LabelDto> Labels { get; set; } = new List<LabelDto>();
    }
}
