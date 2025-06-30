using System.ComponentModel.DataAnnotations;

namespace TaskBoard.Application.Features.Labels.DTOs
{
    public class CreateLabelDto
    {
        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        public string Color { get; set; }
    }
}
