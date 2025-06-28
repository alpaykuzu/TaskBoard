using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Application.Features.Tasks.DTOs
{
    public class UpdateTaskListDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
    }
}
