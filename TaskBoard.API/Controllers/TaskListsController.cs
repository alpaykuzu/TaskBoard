using Microsoft.AspNetCore.Mvc;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;

[Route("api/tasklists")]
[ApiController]
public class TaskListsController : ControllerBase 
{
    private readonly ITaskListRepository _taskListRepository;

    public TaskListsController(ITaskListRepository taskListRepository)
    {
        _taskListRepository = taskListRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskListDto>>> GetBoard()
    {
        var taskLists = await _taskListRepository.GetAllWithCardsAsync();
        var taskListDtos = taskLists.Select(list => new TaskListDto
        {
            Id = list.Id,
            Title = list.Title,
            Order = list.Order,
            TaskCards = list.TaskCards.Select(card => new TaskCardDto
            {
                Id = card.Id,
                Title = card.Title,
                Description = card.Description
            }).ToList()
        }).ToList();
        return Ok(taskListDtos);
    }

    [HttpPost]
    public async Task<ActionResult<TaskListDto>> CreateTaskList([FromBody] CreateTaskListDto createListDto)
    {
        var allLists = await _taskListRepository.GetAllWithCardsAsync();
        var newOrder = allLists.Any() ? allLists.Max(l => l.Order) + 1 : 1;

        var taskListEntity = new TaskList
        {
            Title = createListDto.Title,
            Order = newOrder
        };
        var createdList = await _taskListRepository.AddAsync(taskListEntity);
        var listToReturn = new TaskListDto
        {
            Id = createdList.Id,
            Title = createdList.Title,
            Order = createdList.Order,
            TaskCards = new List<TaskCardDto>()
        };
        return Ok(listToReturn);
    }
}