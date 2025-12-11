using Newtonsoft.Json;

namespace BillingService.Services;

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private readonly string _authServiceUrl;

    public AuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _authServiceUrl = configuration["ServiceUrls:AuthService"] 
            ?? "http://localhost:8080/api/auth/me";
    }

    public async Task<UserInfo?> ValidateTokenAsync(string token)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var response = await _httpClient.GetAsync(_authServiceUrl);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<UserInfo>(content);
            }

            return null;
        }
        catch
        {
            return null;
        }
    }
}
