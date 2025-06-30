using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.API.Extensions;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Labels.DTOs;
using TaskBoard.Domain.Entities;

namespace TaskBoard.API.Controllers
{
    [Authorize]
    [ApiController]
    public class LabelsController : ControllerBase
    {
        private readonly ILabelRepository _labelRepository;
        private readonly IBoardRepository _boardRepository;
        private readonly ITaskCardRepository _taskCardRepository;

        public LabelsController(ILabelRepository labelRepository, IBoardRepository boardRepository, ITaskCardRepository taskCardRepository)
        {
            _labelRepository = labelRepository;
            _boardRepository = boardRepository;
            _taskCardRepository = taskCardRepository;
        }

        // Bir panodaki tüm etiketleri getirir
        // GET /api/boards/{boardId}/labels
        [HttpGet("api/boards/{boardId}/labels")]
        public async Task<IActionResult> GetLabelsForBoard(int boardId)
        {
            var board = await _boardRepository.GetByIdAsync(boardId);
            if (board == null || board.AppUserId != User.GetUserId()) return Forbid();

            var labels = await _labelRepository.GetLabelsByBoardIdAsync(boardId);
            var labelDtos = labels.Select(l => new LabelDto { Id = l.Id, Title = l.Title, Color = l.Color });
            return Ok(labelDtos);
        }

        // Bir panoya yeni bir etiket oluşturur
        // POST /api/boards/{boardId}/labels
        [HttpPost("api/boards/{boardId}/labels")]
        public async Task<IActionResult> CreateLabelForBoard(int boardId, [FromBody] CreateLabelDto createDto)
        {
            var board = await _boardRepository.GetByIdAsync(boardId);
            if (board == null || board.AppUserId != User.GetUserId()) return Forbid();

            var newLabel = new Label { Title = createDto.Title, Color = createDto.Color, BoardId = boardId };
            await _labelRepository.AddAsync(newLabel);
            var labelDto = new LabelDto { Id = newLabel.Id, Title = newLabel.Title, Color = newLabel.Color };
            return Ok(labelDto);
        }

        // Bir karta etiket atar
        // POST /api/taskcards/{cardId}/labels/{labelId}
        [HttpPost("api/taskcards/{cardId}/labels/{labelId}")]
        public async Task<IActionResult> AssignLabelToCard(int cardId, int labelId)
        {
            var userId = User.GetUserId();
            var card = await _taskCardRepository.GetByIdWithLabelsAsync(cardId);
            var label = await _labelRepository.GetByIdAsync(labelId);

            if (card == null || label == null) return NotFound();

            var cardBoard = await _boardRepository.GetByIdAsync(card.TaskList.BoardId);
            if (cardBoard == null || cardBoard.AppUserId != userId || label.BoardId != cardBoard.Id)
            {
                return Forbid();
            }

            if (!card.Labels.Any(l => l.Id == labelId))
            {
                card.Labels.Add(label);
                await _taskCardRepository.UpdateAsync(card);
            }

            return NoContent();
        }

        // Bir karttan etiketi kaldırır
        // DELETE /api/taskcards/{cardId}/labels/{labelId}
        [HttpDelete("api/taskcards/{cardId}/labels/{labelId}")]
        public async Task<IActionResult> RemoveLabelFromCard(int cardId, int labelId)
        {
            var userId = User.GetUserId();
            var card = await _taskCardRepository.GetByIdWithLabelsAsync(cardId);

            if (card == null) return NotFound();

            var cardBoard = await _boardRepository.GetByIdAsync(card.TaskList.BoardId);
            if (cardBoard == null || cardBoard.AppUserId != userId) return Forbid();

            var labelToRemove = card.Labels.FirstOrDefault(l => l.Id == labelId);
            if (labelToRemove != null)
            {
                card.Labels.Remove(labelToRemove);
                await _taskCardRepository.UpdateAsync(card);
            }

            return NoContent();
        }
    }
}
