using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TaskBoard.API.Extensions; // Extension metodumuzu kullanmak için
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Boards.DTOs;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;

namespace TaskBoard.API.Controllers
{
    [Authorize] // <-- ÖNEMLİ: Bu controller'daki tüm endpoint'ler artık giriş yapmayı gerektirir.
    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly IBoardRepository _boardRepository;

        public BoardsController(IBoardRepository boardRepository)
        {
            _boardRepository = boardRepository;
        }

        // Giriş yapmış kullanıcının tüm panolarını getirir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoardDto>>> GetUserBoards()
        {
            var userId = User.GetUserId(); // Token'dan kullanıcı ID'sini alıyoruz
            var boards = await _boardRepository.GetBoardsByUserIdAsync(userId);

            var boardDtos = boards.Select(b => new BoardDto { Id = b.Id, Title = b.Title });

            return Ok(boardDtos);
        }

        // Belirli bir panonun tüm detaylarını (sütunlar ve kartlar) getirir
        [HttpGet("{id}")]
        public async Task<ActionResult<TaskListDto>> GetBoardById(int id)
        {
            var userId = User.GetUserId();
            var board = await _boardRepository.GetBoardWithDetailsAsync(id);

            if (board == null) return NotFound();

            // ÖNEMLİ: Kullanıcı sadece kendi panosuna erişebilir.
            if (board.AppUserId != userId) return Forbid();

            // Entity'leri DTO'lara çeviriyoruz
            var boardDto = new
            {
                Id = board.Id,
                Title = board.Title,
                TaskLists = board.TaskLists.Select(list => new TaskListDto
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
                AppUserId = userId // Panoyu mevcut kullanıcıya bağlıyoruz
            };

            var newBoard = await _boardRepository.AddAsync(boardEntity);
            var boardToReturn = new BoardDto { Id = newBoard.Id, Title = newBoard.Title };

            return CreatedAtAction(nameof(GetBoardById), new { id = newBoard.Id }, boardToReturn);
        }
    }
}
