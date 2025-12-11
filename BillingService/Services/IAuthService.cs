namespace BillingService.Services;

public interface IAuthService
{
    Task<UserInfo?> ValidateTokenAsync(string token);
}

public class UserInfo
{
    public long Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
