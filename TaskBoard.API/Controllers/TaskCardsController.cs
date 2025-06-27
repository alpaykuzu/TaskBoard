// TaskBoard.API/Controllers/TaskCardsController.cs
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Repositories;

[Route("api/taskcards")]
[ApiController]
public class TaskCardsController : ControllerBase
{
    private readonly ITaskCardRepository _taskCardRepository;
    private readonly ITaskListRepository _taskListRepository;

    public TaskCardsController(ITaskCardRepository taskCardRepository, ITaskListRepository taskListRepository)
    {
        _taskCardRepository = taskCardRepository;
        _taskListRepository = taskListRepository;
    }

    // YENİ KART OLUŞTURMA (POST /api/taskcards)
    [HttpPost]
    public async Task<ActionResult<TaskCardDto>> CreateCard([FromBody] CreateTaskCardDto createDto)
    {
        // --- KONTROL ADIMI ---
        // Önce, kartın ekleneceği sütun veritabanında var mı diye kontrol et.
        var listExists = await _taskListRepository.GetByIdAsync(createDto.TaskListId);
        if (listExists == null)
        {
            // Eğer böyle bir sütun yoksa, 400 Bad Request hatası dönerek işlemi durdur.
            return BadRequest($"TaskList with Id {createDto.TaskListId} does not exist.");
        }
        // --- KONTROL BİTTİ ---

        var cardEntity = new TaskCard
        {
            Title = createDto.Title,
            Description = createDto.Description,
            TaskListId = createDto.TaskListId
        };

        var newCard = await _taskCardRepository.AddAsync(cardEntity);

        var cardToReturn = new TaskCardDto
        {
            Id = newCard.Id,
            Title = newCard.Title,
            Description = newCard.Description
        };

        return Ok(cardToReturn);
    }

    // KART GÜNCELLEME (PUT /api/taskcards/{id})
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCard(int id, [FromBody] UpdateTaskCardDto updateDto)
    {
        var cardToUpdate = await _taskCardRepository.GetByIdAsync(id);
        if (cardToUpdate == null) return NotFound();

        cardToUpdate.Title = updateDto.Title;
        cardToUpdate.Description = updateDto.Description;
        await _taskCardRepository.UpdateAsync(cardToUpdate);
        return NoContent();
    }

    // KART SİLME (DELETE /api/taskcards/{id})
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCard(int id)
    {
        var cardToDelete = await _taskCardRepository.GetByIdAsync(id);
        if (cardToDelete == null) return NotFound();

        await _taskCardRepository.DeleteAsync(cardToDelete);
        return NoContent();
    }
}