using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.API.Extensions;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Application.Features.Boards.DTOs;
using TaskBoard.Domain.Entities;
using System.Collections.Generic;

namespace TaskBoard.API.Controllers
{
    [Authorize]
    [Route("api/boards/{boardId}/tasklists")]
    [ApiController]
    public class TaskListsController : ControllerBase
    {
        private readonly ITaskListRepository _taskListRepository;
        private readonly IBoardRepository _boardRepository;

        public TaskListsController(ITaskListRepository taskListRepository, IBoardRepository boardRepository)
        {
            _taskListRepository = taskListRepository;
            _boardRepository = boardRepository;
        }

        [HttpPost]
        public async Task<ActionResult<TaskListDto>> CreateTaskList(int boardId, [FromBody] CreateTaskListDto createDto)
        {
            var userId = User.GetUserId();
            var board = await _boardRepository.GetBoardWithDetailsAsync(boardId);
            if (board == null || board.AppUserId != userId) return Forbid();

            var newOrder = board.TaskLists.Any() ? board.TaskLists.Max(l => l.Order) + 1 : 1;
            var taskListEntity = new TaskList { Title = createDto.Title, BoardId = boardId, Order = newOrder };
            var createdList = await _taskListRepository.AddAsync(taskListEntity);
            var listToReturn = new TaskListDto { Id = createdList.Id, Title = createdList.Title, Order = createdList.Order, TaskCards = new List<TaskCardDto>() };
            return Ok(listToReturn);
        }

        [HttpPut("{listId}")]
        public async Task<IActionResult> UpdateTaskList(int boardId, int listId, [FromBody] UpdateTaskListDto updateDto)
        {
            var userId = User.GetUserId();
            var board = await _boardRepository.GetByIdAsync(boardId);
            if (board == null || board.AppUserId != userId) return Forbid();

            var taskListToUpdate = await _taskListRepository.GetByIdAsync(listId);
            if (taskListToUpdate == null || taskListToUpdate.BoardId != boardId) return NotFound();

            taskListToUpdate.Title = updateDto.Title;
            await _taskListRepository.UpdateAsync(taskListToUpdate);
            return NoContent();
        }

        [HttpDelete("{listId}")]
        public async Task<IActionResult> DeleteTaskList(int boardId, int listId)
        {
            var userId = User.GetUserId();
            var board = await _boardRepository.GetByIdAsync(boardId);
            if (board == null || board.AppUserId != userId) return Forbid();

            var taskListToDelete = await _taskListRepository.GetByIdAsync(listId);
            if (taskListToDelete == null || taskListToDelete.BoardId != boardId) return NotFound();

            await _taskListRepository.DeleteAsync(taskListToDelete);
            return NoContent();
        }
    }
}
