using System.Security.Claims;

namespace TaskBoard.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        // Bu metot, controller içinden `User.GetUserId()` şeklinde çağrılacak.
        public static string GetUserId(this ClaimsPrincipal user)
        {
            // JWT'nin içindeki 'NameIdentifier' claim'i, bizim AppUser'ımızın Id'sine karşılık gelir.
            return user.FindFirstValue(ClaimTypes.NameIdentifier);
        }
    }
}
