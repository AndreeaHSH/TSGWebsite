using TSGwebsite.Models;

namespace TSGwebsite.Services
{
    public interface IPdfService
    {
        Task<byte[]> GenerateVolunteerApplicationPdfAsync(Volunteer volunteer);
    }
}