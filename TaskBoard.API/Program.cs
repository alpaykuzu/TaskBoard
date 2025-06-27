using Microsoft.EntityFrameworkCore;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Infrastructure.Persistence;
using TaskBoard.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// *** BAÞLANGIÇ: CORS Politikasýný Ekle ***
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // React uygulamasýnýn çalýþtýðý adresi buraya yazýyoruz
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddDbContext<TaskBoardDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITaskCardRepository, TaskCardRepository>();
builder.Services.AddScoped<ITaskListRepository, TaskListRepository>();

// Add services to the container.
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// *** EKLENECEK SATIR: CORS Politikasýný Uygula ***
// Bu satýr UseAuthorization'dan ÖNCE olmalý.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();