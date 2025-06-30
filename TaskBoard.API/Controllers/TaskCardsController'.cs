using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TaskBoard.API.Extensions;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;

namespace TaskBoard.API.Controllers
{
    [Authorize] // Bu controller'daki tüm endpoint'ler giriş yapmayı gerektirir.
    [Route("api/taskcards")]
    [ApiController]
    public class TaskCardsController : ControllerBase
    {
        private readonly ITaskCardRepository _taskCardRepository;
        private readonly ITaskListRepository _taskListRepository;
        private readonly IBoardRepository _boardRepository;

        public TaskCardsController(
            ITaskCardRepository taskCardRepository,
            ITaskListRepository taskListRepository,
            IBoardRepository boardRepository)
        {
            _taskCardRepository = taskCardRepository;
            _taskListRepository = taskListRepository;
            _boardRepository = boardRepository;
        }

        // YENİ KART OLUŞTURMA (POST /api/taskcards)
        [HttpPost]
        public async Task<ActionResult<TaskCardDto>> CreateCard([FromBody] CreateTaskCardDto createDto)
        {
            var userId = User.GetUserId();
            var parentList = await _taskListRepository.GetByIdAsync(createDto.TaskListId);

            if (parentList == null)
            {
                return BadRequest("Parent task list not found.");
            }

            // Güvenlik Kontrolü: Kullanıcının, o listeyi içeren panonun sahibi olup olmadığını kontrol et.
            var parentBoard = await _boardRepository.GetByIdAsync(parentList.BoardId);
            if (parentBoard == null || parentBoard.AppUserId != userId)
            {
                return Forbid();
            }

            var cardEntity = new TaskCard
            {
                Title = createDto.Title,
                Description = createDto.Description,
                TaskListId = createDto.TaskListId,
                DueDate = createDto.DueDate, // Yeni alanı ekledik
                CreatedAt = DateTime.UtcNow // Oluşturulma zamanını sunucu saatiyle anında atıyoruz
            };

            var newCard = await _taskCardRepository.AddAsync(cardEntity);

            var cardToReturn = new TaskCardDto
            {
                Id = newCard.Id,
                Title = newCard.Title,
                Description = newCard.Description,
                CreatedAt = newCard.CreatedAt,
                DueDate = newCard.DueDate
            };
            return Ok(cardToReturn);
        }

        // KART GÜNCELLEME (PUT /api/taskcards/{id})
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCard(int id, [FromBody] UpdateTaskCardDto updateDto)
        {
            var userId = User.GetUserId();
            var cardToUpdate = await _taskCardRepository.GetByIdWithParentAsync(id); // <-- Değişiklik

            if (cardToUpdate == null) return NotFound();

            var parentBoard = await _boardRepository.GetByIdAsync(cardToUpdate.TaskList.BoardId);
            if (parentBoard == null || parentBoard.AppUserId != userId) return Forbid();

            cardToUpdate.Title = updateDto.Title;
            cardToUpdate.Description = updateDto.Description;
            cardToUpdate.DueDate = updateDto.DueDate; // Yeni alanı ekledik

            await _taskCardRepository.UpdateAsync(cardToUpdate);

            return NoContent();
        }

        // KART SİLME (DELETE /api/taskcards/{id})
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var userId = User.GetUserId();
            var cardToDelete = await _taskCardRepository.GetByIdWithParentAsync(id); // <-- Değişiklik

            if (cardToDelete == null) return NotFound();

            var parentBoard = await _boardRepository.GetByIdAsync(cardToDelete.TaskList.BoardId);
            if (parentBoard == null || parentBoard.AppUserId != userId) return Forbid();

            await _taskCardRepository.DeleteAsync(cardToDelete);

            return NoContent();
        }

        // KARTI TAŞIMA (PUT /api/taskcards/{cardId}/move/{newListId})
        [HttpPut("{cardId}/move/{newListId}")]
        public async Task<IActionResult> MoveCard(int cardId, int newListId)
        {
            var userId = User.GetUserId();
            var cardToMove = await _taskCardRepository.GetByIdWithParentAsync(cardId); // <-- Değişiklik
            var newList = await _taskListRepository.GetByIdAsync(newListId);

            if (cardToMove == null || newList == null) return NotFound("Card or new list not found.");

            var originalBoard = await _boardRepository.GetByIdAsync(cardToMove.TaskList.BoardId);
            var newBoard = await _boardRepository.GetByIdAsync(newList.BoardId);

            if (originalBoard == null || newBoard == null || originalBoard.AppUserId != userId || newBoard.AppUserId != userId) return Forbid();

            cardToMove.TaskListId = newListId;
            await _taskCardRepository.UpdateAsync(cardToMove);

            return NoContent();
        }
    }
}
