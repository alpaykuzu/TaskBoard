// TaskBoard.Domain/Entities/AppUser.cs
using Microsoft.AspNetCore.Identity;

namespace TaskBoard.Domain.Entities
{
    // IdentityUser sınıfından kalıtım alarak Identity'nin tüm standart özelliklerini
    // (Id, UserName, Email, PasswordHash vb.) miras alıyoruz.
    public class AppUser : IdentityUser
    {
        // Gelecekte buraya public string FullName { get; set; } gibi alanlar ekleyebiliriz.
    }
}