using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskBoard.Application.Contracts.Persistence;
using TaskBoard.Domain.Entities;
using TaskBoard.Infrastructure.Persistence;
using TaskBoard.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// *** BA�LANGI�: CORS Politikas�n� Ekle ***
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          // React uygulamas�n�n �al��t��� adresi buraya yaz�yoruz
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

// --- IDENTITY servisini ekliyoruz ---
builder.Services.AddIdentity<AppUser, IdentityRole>()
    .AddEntityFrameworkStores<TaskBoardDbContext>()
    .AddDefaultTokenProviders();

// --- JWT AUTHENTICATION servisini ekliyoruz ---
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

builder.Services.AddDbContext<TaskBoardDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ITaskCardRepository, TaskCardRepository>();
builder.Services.AddScoped<ITaskListRepository, TaskListRepository>();
builder.Services.AddScoped<IBoardRepository, BoardRepository>();

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

// Bu sat�r UseAuthorization'dan �NCE olmal�.
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();