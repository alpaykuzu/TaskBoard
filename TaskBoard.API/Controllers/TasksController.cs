using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Application.Features.Tasks.DTOs;
using TaskBoard.Domain.Entities;


namespace TaskBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly ITaskCardRepository _taskCardRepository;
        public TasksController(ITaskCardRepository taskCardRepository)
        {
            _taskCardRepository = taskCardRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TaskCardDto>>> GetTasks()
        {
            var tasks = await _taskCardRepository.GetAllAsync();

            var taskDtos = tasks.Select(task => new TaskCardDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description
            });

            return Ok(taskDtos);
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)] // Başarılı olursa 201 döneceğini belirtiyoruz (Swagger için)
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // Geçersiz veri gelirse 400 döneceğini belirtiyoruz
        public async Task<ActionResult<TaskCardDto>> CreateTask([FromBody] CreateTaskCardDto createTaskCardDto)
        {
            // Gelen DTO'yu, veritabanına kaydedeceğimiz Domain Entity'sine çeviriyoruz (Mapping).
            var taskEntity = new Domain.Entities.TaskCard
            {
                Title = createTaskCardDto.Title,
                Description = createTaskCardDto.Description
            };

            var newTask = await _taskCardRepository.AddAsync(taskEntity);

            // Veritabanından dönen (artık Id'si olan) entity'yi,
            // istemciye göndereceğimiz DTO'ya çeviriyoruz.
            var taskToReturn = new TaskCardDto
            {
                Id = newTask.Id,
                Title = newTask.Title,
                Description = newTask.Description
            };

            return Ok(taskToReturn);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)] 
        [ProducesResponseType(StatusCodes.Status404NotFound)]   
        public async Task<IActionResult> DeleteTask(int id)
        {
            // Önce silinecek görevin veritabanında olup olmadığını kontrol et
            var taskToDelete = await _taskCardRepository.GetByIdAsync(id);

            if (taskToDelete == null)
            {
                return NotFound(); // Bulunamadıysa 404 hatası dön
            }

            // Görevi sil
            await _taskCardRepository.DeleteAsync(taskToDelete);

            // Silme işlemi başarılı olduğunda standart olarak 204 No Content durum kodu dönülür.
            // Bu, "İşlem başarılı ve dönecek bir içeriğim yok" demektir.
            return NoContent();
        }


        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] UpdateTaskCardDto updateDto)
        {
            // Önce güncellenecek görevi veritabanında bul
            var taskToUpdate = await _taskCardRepository.GetByIdAsync(id);

            if (taskToUpdate == null)
            {
                return NotFound();
            }

            // Bulunan entity'nin property'lerini DTO'dan gelen yeni verilerle güncelle
            taskToUpdate.Title = updateDto.Title;
            taskToUpdate.Description = updateDto.Description;

            // Değişiklikleri kaydetmek için repository'yi çağır
            await _taskCardRepository.UpdateAsync(taskToUpdate);

            return NoContent(); // Başarılı güncellemede 204 dön
        }
    }
}
