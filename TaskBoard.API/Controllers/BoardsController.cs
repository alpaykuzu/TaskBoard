using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.API.Extensions;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Boards.DTOs;
using TaskBoard.Application.Features.Labels.DTOs;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Repositories;

namespace TaskBoard.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly IBoardRepository _boardRepository;
        private readonly ILabelRepository _labelRepository;

        public BoardsController(IBoardRepository boardRepository, ILabelRepository labelRepository)
        {
            _boardRepository = boardRepository;
            _labelRepository = labelRepository;
        }

        // Giriş yapmış kullanıcının tüm panolarını getirir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoardDto>>> GetUserBoards()
        {
            var userId = User.GetUserId();
            var boards = await _boardRepository.GetBoardsByUserIdAsync(userId);
            var boardDtos = boards.Select(b => new BoardDto { Id = b.Id, Title = b.Title });
            return Ok(boardDtos);
        }

        // Belirli bir panonun tüm detaylarını (sütunlar ve kartlar) getirir
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetBoardById(int id)
        {
            var userId = User.GetUserId();
            var board = await _boardRepository.GetBoardWithDetailsAsync(id);
            if (board == null || board.AppUserId != userId) return Forbid();

            // Panoya ait tüm etiketleri de ayrıca getiriyoruz.
            var labelsForBoard = await _labelRepository.GetLabelsByBoardIdAsync(id);

            var boardDto = new
            {
                Id = board.Id,
                Title = board.Title,
                // --- ANA DÜZELTME 1 ---
                // Cevabın en üst seviyesine panoya ait tüm etiketleri ekliyoruz.
                Labels = labelsForBoard.Select(l => new LabelDto { Id = l.Id, Title = l.Title, Color = l.Color }).ToList(),
                TaskLists = board.TaskLists.Select(list => new TaskListDto
                {
                    Id = list.Id,
                    Title = list.Title,
                    Order = list.Order,
                    TaskCards = list.TaskCards.Select(card => new TaskCardDto
                    {
                        Id = card.Id,
                        Title = card.Title,
                        Description = card.Description,
                        CreatedAt = DateTime.SpecifyKind(card.CreatedAt, DateTimeKind.Utc),
                        DueDate = card.DueDate.HasValue ? DateTime.SpecifyKind(card.DueDate.Value, DateTimeKind.Utc) : null,
                        // --- ANA DÜZELTME 2 ---
                        // Her kartın kendi etiketlerini de eklemeye devam ediyoruz.
                        Labels = card.Labels.Select(l => new LabelDto { Id = l.Id, Title = l.Title, Color = l.Color }).ToList()
                    }).ToList()
                }).OrderBy(l => l.Order).ToList()
            };

            return Ok(boardDto);
        }

        // Yeni bir pano oluşturur
        [HttpPost]
        public async Task<ActionResult<BoardDto>> CreateBoard([FromBody] CreateBoardDto createDto)
        {
            var userId = User.GetUserId();
            var boardEntity = new Board
            {
                Title = createDto.Title,
                AppUserId = userId
            };
            var newBoard = await _boardRepository.AddAsync(boardEntity);
            var boardToReturn = new BoardDto { Id = newBoard.Id, Title = newBoard.Title };
            return CreatedAtAction(nameof(GetBoardById), new { id = newBoard.Id }, boardToReturn);
        }
    }
}
