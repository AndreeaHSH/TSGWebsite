using MailKit.Net.Smtp;
using MimeKit;
using TSGwebsite.Models;

namespace TSGwebsite.Services
{
    public interface IEmailService
    {
        Task<bool> SendNewApplicationNotificationAsync(Volunteer volunteer);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendNewApplicationNotificationAsync(Volunteer volunteer)
        {
            try
            {
                var message = new MimeMessage();
                
                // From
                var fromEmail = _configuration["EmailSettings:FromEmail"] ?? "noreply@tsg.com";
                var fromName = _configuration["EmailSettings:FromName"] ?? "TSG Volunteer System";
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                
                // To (HR Email)
                var hrEmail = _configuration["EmailSettings:HrEmail"] ?? "hr@tsg.com";
                message.To.Add(new MailboxAddress("HR TSG", hrEmail));
                
                // Subject
                message.Subject = $"Aplicație Nouă de Voluntariat TSG - {volunteer.FullName}";
                
                // Body
                var htmlBody = CreateEmailBody(volunteer);
                message.Body = new TextPart("html") { Text = htmlBody };
                
                // Send email
                using var client = new SmtpClient();
                
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var username = _configuration["EmailSettings:Username"];
                var password = _configuration["EmailSettings:Password"];
                
                await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                
                if (!string.IsNullOrEmpty(username) && !string.IsNullOrEmpty(password))
                {
                    await client.AuthenticateAsync(username, password);
                }
                
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                
                _logger.LogInformation($"Email sent successfully for volunteer: {volunteer.FullName}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email for volunteer: {volunteer.FullName}");
                return false;
            }
        }

        private string CreateEmailBody(Volunteer volunteer)
        {
            return $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #FF6D48, #E55A3A); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }}
        .section {{ margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px; }}
        .section h3 {{ color: #FF6D48; margin-top: 0; border-bottom: 2px solid #FF6D48; padding-bottom: 5px; }}
        table {{ width: 100%; border-collapse: collapse; }}
        td {{ padding: 8px; border-bottom: 1px solid #ddd; }}
        .label {{ font-weight: bold; width: 200px; color: #555; }}
        .value {{ color: #333; }}
        .footer {{ background: #333; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Aplicație Nouă de Voluntariat TSG</h1>
            <p>O aplicație nouă de voluntariat a fost trimisă prin site-ul TSG.</p>
        </div>

        <div class='section'>
            <h3>👤 Informații Personale</h3>
            <table>
                <tr><td class='label'>Nume complet:</td><td class='value'>{volunteer.FirstName} {volunteer.LastName}</td></tr>
                <tr><td class='label'>Email:</td><td class='value'>{volunteer.Email}</td></tr>
                <tr><td class='label'>Telefon:</td><td class='value'>{volunteer.Phone}</td></tr>
                <tr><td class='label'>Data nașterii:</td><td class='value'>{volunteer.BirthDate:dd/MM/yyyy} ({volunteer.Age} ani)</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>🎓 Informații Academice</h3>
            <table>
                <tr><td class='label'>Facultatea:</td><td class='value'>{volunteer.Faculty}</td></tr>
                <tr><td class='label'>Specializarea:</td><td class='value'>{volunteer.Specialization}</td></tr>
                <tr><td class='label'>Anul de studiu:</td><td class='value'>{volunteer.StudyYear}</td></tr>
                <tr><td class='label'>Numărul de matricol:</td><td class='value'>{volunteer.StudentId ?? "Nu a fost specificat"}</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>💼 Preferințe de Rol</h3>
            <table>
                <tr><td class='label'>Rolul preferat:</td><td class='value'>{volunteer.PreferredRole}</td></tr>
                <tr><td class='label'>Rol alternativ:</td><td class='value'>{volunteer.AlternativeRole ?? "Nu a fost specificat"}</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>⚙️ Competențe Tehnice</h3>
            <table>
                <tr><td class='label'>Limbaje de programare:</td><td class='value'>{volunteer.ProgrammingLanguages ?? "Nu a fost specificat"}</td></tr>
                <tr><td class='label'>Framework-uri:</td><td class='value'>{volunteer.Frameworks ?? "Nu a fost specificat"}</td></tr>
                <tr><td class='label'>Tools:</td><td class='value'>{volunteer.Tools ?? "Nu a fost specificat"}</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>💡 Experiență și Motivație</h3>
            <table>
                <tr><td class='label'>Experiența anterioară:</td><td class='value'>{volunteer.Experience ?? "Nu a fost specificată"}</td></tr>
                <tr><td class='label'>Motivația pentru TSG:</td><td class='value'>{volunteer.Motivation}</td></tr>
                <tr><td class='label'>Cum poate contribui:</td><td class='value'>{volunteer.Contribution}</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>⏰ Disponibilitate</h3>
            <table>
                <tr><td class='label'>Timpul dedicat:</td><td class='value'>{volunteer.TimeCommitment}</td></tr>
                <tr><td class='label'>Program preferat:</td><td class='value'>{volunteer.Schedule ?? "Nu a fost specificat"}</td></tr>
            </table>
        </div>

        <div class='section'>
            <h3>📁 Portfolio și Documente</h3>
            <table>
                <tr><td class='label'>Portfolio/GitHub:</td><td class='value'>{(string.IsNullOrEmpty(volunteer.PortfolioUrl) ? "Nu a fost specificat" : $"<a href='{volunteer.PortfolioUrl}'>{volunteer.PortfolioUrl}</a>")}</td></tr>
                <tr><td class='label'>CV:</td><td class='value'>{(!string.IsNullOrEmpty(volunteer.CvFileName) ? $"✅ {volunteer.CvFileName}" : "❌ Nu a fost încărcat CV")}</td></tr>
            </table>
        </div>

        <div class='footer'>
            <p><strong>📅 Data aplicației:</strong> {volunteer.SubmittedAt:dd/MM/yyyy HH:mm}</p>
            <p>Vă rugăm să verificați aplicația în panoul de administrare TSG.</p>
            <p><strong>🔗 Link admin:</strong> <a href='http://localhost:4201/aplicari/{volunteer.Id}' style='color: #FFD700;'>Vezi detaliile aplicației</a></p>
        </div>
    </div>
</body>
</html>";
        }
    }
}