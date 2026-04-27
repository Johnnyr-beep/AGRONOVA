using MataderoAPI.DTOs;
using System.Threading.Tasks;

namespace MataderoAPI.Services
{
    public interface IAuthService
    {
        Task<TokenResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
