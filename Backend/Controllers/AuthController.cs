using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using TSGwebsite.Models;

namespace TSGwebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        [HttpGet("login-url")]
        public IActionResult GetLoginUrl()
        {
            var keycloakConfig = _configuration.GetSection("Keycloak");
            var serverUrl = keycloakConfig["ServerUrl"];
            var realm = keycloakConfig["Realm"];
            var clientId = keycloakConfig["ClientId"];
            
            var redirectUri = "http://localhost:4201/auth/callback";
            
            var loginUrl = $"{serverUrl}/realms/{realm}/protocol/openid-connect/auth" +
                          $"?client_id={clientId}" +
                          $"&redirect_uri={Uri.EscapeDataString(redirectUri)}" +
                          $"&response_type=code" +
                          $"&scope=openid profile email";

            return Ok(new { loginUrl });
        }

        [HttpPost("token")]
        public async Task<IActionResult> ExchangeCodeForToken([FromBody] TokenExchangeRequest request)
        {
            try
            {
                var keycloakConfig = _configuration.GetSection("Keycloak");
                var serverUrl = keycloakConfig["ServerUrl"];
                var realm = keycloakConfig["Realm"];
                var clientId = keycloakConfig["ClientId"];
                var clientSecret = keycloakConfig["ClientSecret"];
                
                var tokenEndpoint = $"{serverUrl}/realms/{realm}/protocol/openid-connect/token";
                
                using var httpClient = new HttpClient();
                
                var tokenRequest = new FormUrlEncodedContent(new[]
                {
                    new KeyValuePair<string, string>("grant_type", "authorization_code"),
                    new KeyValuePair<string, string>("client_id", clientId),
                    new KeyValuePair<string, string>("client_secret", clientSecret),
                    new KeyValuePair<string, string>("code", request.Code),
                    new KeyValuePair<string, string>("redirect_uri", request.RedirectUri)
                });

                var response = await httpClient.PostAsync(tokenEndpoint, tokenRequest);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return Ok(responseContent);
                }
                else
                {
                    _logger.LogError($"Token exchange failed: {responseContent}");
                    return BadRequest(new { error = "Token exchange failed" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token exchange");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("user-info")]
        [Authorize]
        public IActionResult GetUserInfo()
        {
            try
            {
                var user = new
                {
                    Id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                    Username = User.FindFirst("preferred_username")?.Value,
                    Email = User.FindFirst(ClaimTypes.Email)?.Value,
                    FirstName = User.FindFirst(ClaimTypes.GivenName)?.Value,
                    LastName = User.FindFirst(ClaimTypes.Surname)?.Value,
                    Roles = User.FindAll("realm_access")?.Select(c => c.Value).ToList()
                };

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user info");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            var keycloakConfig = _configuration.GetSection("Keycloak");
            var serverUrl = keycloakConfig["ServerUrl"];
            var realm = keycloakConfig["Realm"];
            
            var logoutUrl = $"{serverUrl}/realms/{realm}/protocol/openid-connect/logout";
            
            return Ok(new { logoutUrl });
        }
    }

    public class TokenExchangeRequest
    {
        public string Code { get; set; } = string.Empty;
        public string RedirectUri { get; set; } = string.Empty;
    }
}