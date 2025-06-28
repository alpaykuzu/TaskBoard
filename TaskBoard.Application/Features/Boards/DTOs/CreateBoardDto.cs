using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Application.Features.Boards.DTOs
{
    public class CreateBoardDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }
    }
}
