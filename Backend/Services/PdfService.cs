using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.IO.Font.Constants;
using TSGwebsite.Models;
using System.Text;

namespace TSGwebsite.Services
{
    public class PdfService : IPdfService
    {
        public async Task<byte[]> GenerateVolunteerApplicationPdfAsync(Volunteer volunteer)
        {
            return await Task.Run(() => GenerateVolunteerApplicationPdf(volunteer));
        }

        private byte[] GenerateVolunteerApplicationPdf(Volunteer volunteer)
        {
            using (var memoryStream = new MemoryStream())
            {
                // Create PDF writer and document
                var writer = new PdfWriter(memoryStream);
                var pdf = new PdfDocument(writer);
                var document = new Document(pdf);

                // Define fonts
                var titleFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                var headerFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                var labelFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);
                var valueFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);
                var smallFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA);

                // Define colors
                var tsgOrange = new DeviceRgb(255, 109, 72);
                var darkGray = new DeviceRgb(64, 64, 64);
                var lightGray = new DeviceRgb(240, 240, 240);

                // Header Section
                var headerTable = new Table(2).UseAllAvailableWidth();
                headerTable.SetWidth(UnitValue.CreatePercentValue(100));

                // TSG Logo cell
                var logoCell = new Cell()
                    .Add(new Paragraph("TSG")
                        .SetFont(titleFont)
                        .SetFontSize(18)
                        .SetFontColor(ColorConstants.WHITE)
                        .SetTextAlignment(TextAlignment.CENTER))
                    .SetBackgroundColor(tsgOrange)
                    .SetBorder(Border.NO_BORDER)
                    .SetPadding(10)
                    .SetTextAlignment(TextAlignment.CENTER);

                // Title cell
                var titleCell = new Cell()
                    .Add(new Paragraph("APLICAȚIE VOLUNTARIAT\nTRANSILVANIA STAR GROUP")
                        .SetFont(titleFont)
                        .SetFontSize(16)
                        .SetFontColor(darkGray))
                    .SetBorder(Border.NO_BORDER)
                    .SetPadding(10)
                    .SetVerticalAlignment(VerticalAlignment.MIDDLE);

                headerTable.AddCell(logoCell);
                headerTable.AddCell(titleCell);
                document.Add(headerTable);
                
                // Add space
                document.Add(new Paragraph(" "));

                // Application metadata
                var metaTable = new Table(2).UseAllAvailableWidth();
                metaTable.AddCell(CreateInfoCell("Data aplicației:", volunteer.SubmittedAt.ToString("dd/MM/yyyy HH:mm"), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("ID Aplicație:", volunteer.Id.ToString(), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("Status:", GetStatusText(volunteer.Status), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("Favorit:", volunteer.IsFavorite ? "Da" : "Nu", labelFont, valueFont));

                document.Add(metaTable);
                document.Add(new Paragraph(" "));

                // Personal Information Section
                AddSectionTitle(document, "INFORMAȚII PERSONALE", headerFont, tsgOrange);
                var personalTable = new Table(2).UseAllAvailableWidth();

                personalTable.AddCell(CreateInfoCell("Nume:", volunteer.LastName, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Prenume:", volunteer.FirstName, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Email:", volunteer.Email, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Telefon:", volunteer.Phone, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Data nașterii:", volunteer.BirthDate.ToString("dd/MM/yyyy"), labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Vârsta:", $"{volunteer.Age} ani", labelFont, valueFont));

                document.Add(personalTable);
                document.Add(new Paragraph(" "));

                // Academic Information Section
                AddSectionTitle(document, "INFORMAȚII ACADEMICE", headerFont, tsgOrange);
                var academicTable = new Table(2).UseAllAvailableWidth();

                academicTable.AddCell(CreateInfoCell("Facultatea:", volunteer.Faculty, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Specializarea:", volunteer.Specialization, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Anul de studiu:", volunteer.StudyYear, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Numărul de matricol:", volunteer.StudentId ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(academicTable);
                document.Add(new Paragraph(" "));

                // Role Preferences Section
                AddSectionTitle(document, "PREFERINȚE DE ROL", headerFont, tsgOrange);
                var roleTable = new Table(1).UseAllAvailableWidth();

                roleTable.AddCell(CreateInfoCell("Rolul preferat:", volunteer.PreferredRole, labelFont, valueFont));
                roleTable.AddCell(CreateInfoCell("Rol alternativ:", volunteer.AlternativeRole ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(roleTable);
                document.Add(new Paragraph(" "));

                // Technical Skills Section
                AddSectionTitle(document, "COMPETENȚE TEHNICE", headerFont, tsgOrange);
                var skillsTable = new Table(1).UseAllAvailableWidth();

                skillsTable.AddCell(CreateInfoCell("Limbaje de programare:", volunteer.ProgrammingLanguages ?? "Nu a fost specificat", labelFont, valueFont));
                skillsTable.AddCell(CreateInfoCell("Framework-uri:", volunteer.Frameworks ?? "Nu a fost specificat", labelFont, valueFont));
                skillsTable.AddCell(CreateInfoCell("Tools:", volunteer.Tools ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(skillsTable);
                document.Add(new Paragraph(" "));

                // Experience and Motivation Section
                AddSectionTitle(document, "EXPERIENȚĂ ȘI MOTIVAȚIE", headerFont, tsgOrange);
                var experienceTable = new Table(1).UseAllAvailableWidth();

                experienceTable.AddCell(CreateLongTextCell("Experiența anterioară:", volunteer.Experience ?? "Nu a fost specificată", labelFont, valueFont));
                experienceTable.AddCell(CreateLongTextCell("Motivația pentru TSG:", volunteer.Motivation, labelFont, valueFont));
                experienceTable.AddCell(CreateLongTextCell("Cum poate contribui:", volunteer.Contribution, labelFont, valueFont));

                document.Add(experienceTable);
                document.Add(new Paragraph(" "));

                // Availability Section
                AddSectionTitle(document, "DISPONIBILITATE", headerFont, tsgOrange);
                var availabilityTable = new Table(2).UseAllAvailableWidth();

                availabilityTable.AddCell(CreateInfoCell("Timpul dedicat:", volunteer.TimeCommitment, labelFont, valueFont));
                availabilityTable.AddCell(CreateInfoCell("Program preferat:", volunteer.Schedule ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(availabilityTable);
                document.Add(new Paragraph(" "));

                // Documents and Portfolio Section
                AddSectionTitle(document, "DOCUMENTE ȘI PORTOFOLIU", headerFont, tsgOrange);
                var documentsTable = new Table(1).UseAllAvailableWidth();

                documentsTable.AddCell(CreateInfoCell("Portfolio/GitHub:", volunteer.PortfolioUrl ?? "Nu a fost specificat", labelFont, valueFont));
                documentsTable.AddCell(CreateInfoCell("CV:", !string.IsNullOrEmpty(volunteer.CvFileName) ? 
                    $"✓ {volunteer.CvFileName} ({FormatFileSize(volunteer.CvFileSize)})" : 
                    "Nu a fost încărcat CV", labelFont, valueFont));

                document.Add(documentsTable);
                document.Add(new Paragraph(" "));

                // Agreements Section
                AddSectionTitle(document, "ACORDURI ȘI CONSIMȚĂMINTE", headerFont, tsgOrange);
                var agreementsTable = new Table(1).UseAllAvailableWidth();

                agreementsTable.AddCell(CreateInfoCell("Acord prelucrare date:", volunteer.DataProcessingAgreement ? "✓ Acceptat" : "❌ Refuzat", labelFont, valueFont));
                agreementsTable.AddCell(CreateInfoCell("Acord termeni și condiții:", volunteer.TermsAgreement ? "✓ Acceptat" : "❌ Refuzat", labelFont, valueFont));

                document.Add(agreementsTable);
                document.Add(new Paragraph(" "));

                // Admin Section (if applicable)
                if (!string.IsNullOrEmpty(volunteer.ReviewNotes) || volunteer.ReviewedAt.HasValue)
                {
                    AddSectionTitle(document, "NOTIȚE ADMINISTRATIVE", headerFont, tsgOrange);
                    var adminTable = new Table(1).UseAllAvailableWidth();

                    if (volunteer.ReviewedAt.HasValue)
                        adminTable.AddCell(CreateInfoCell("Data revizuirii:", volunteer.ReviewedAt.Value.ToString("dd/MM/yyyy HH:mm"), labelFont, valueFont));
                    
                    if (!string.IsNullOrEmpty(volunteer.ReviewNotes))
                        adminTable.AddCell(CreateLongTextCell("Notițe admin:", volunteer.ReviewNotes, labelFont, valueFont));

                    document.Add(adminTable);
                }

                // Footer
                document.Add(new Paragraph(" "));
                var footer = new Paragraph($"Document generat automat • {DateTime.Now:dd/MM/yyyy HH:mm} • Transilvania Star Group")
                    .SetFont(smallFont)
                    .SetFontSize(8)
                    .SetFontColor(ColorConstants.GRAY)
                    .SetTextAlignment(TextAlignment.CENTER);
                document.Add(footer);

                document.Close();
                return memoryStream.ToArray();
            }
        }

        private void AddSectionTitle(Document document, string title, PdfFont font, DeviceRgb color)
        {
            var titleParagraph = new Paragraph(title)
                .SetFont(font)
                .SetFontSize(14)
                .SetFontColor(color)
                .SetMarginTop(10)
                .SetMarginBottom(10);
            document.Add(titleParagraph);
        }

        private Cell CreateInfoCell(string label, string value, PdfFont labelFont, PdfFont valueFont)
        {
            var cell = new Cell()
                .SetBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 1))
                .SetBorderTop(Border.NO_BORDER)
                .SetBorderLeft(Border.NO_BORDER)
                .SetBorderRight(Border.NO_BORDER)
                .SetPadding(8);

            var paragraph = new Paragraph()
                .Add(new Text(label + "\n").SetFont(labelFont).SetFontSize(10))
                .Add(new Text(value).SetFont(valueFont).SetFontSize(10));
            
            cell.Add(paragraph);
            return cell;
        }

        private Cell CreateLongTextCell(string label, string value, PdfFont labelFont, PdfFont valueFont)
        {
            var cell = new Cell()
                .SetBorderBottom(new SolidBorder(ColorConstants.LIGHT_GRAY, 1))
                .SetBorderTop(Border.NO_BORDER)
                .SetBorderLeft(Border.NO_BORDER)
                .SetBorderRight(Border.NO_BORDER)
                .SetPadding(8);

            var paragraph = new Paragraph()
                .Add(new Text(label + "\n").SetFont(labelFont).SetFontSize(10))
                .Add(new Text(value).SetFont(valueFont).SetFontSize(10));
            
            cell.Add(paragraph);
            return cell;
        }

        private string GetStatusText(VolunteerStatus status)
        {
            return status switch
            {
                VolunteerStatus.Pending => "În așteptare",
                VolunteerStatus.Reviewed => "Revizuit",
                VolunteerStatus.Approved => "Aprobat",
                VolunteerStatus.Rejected => "Respins",
                VolunteerStatus.Contacted => "Contactat",
                VolunteerStatus.Active => "Activ",
                VolunteerStatus.Inactive => "Inactiv",
                _ => status.ToString()
            };
        }

        private string FormatFileSize(long? bytes)
        {
            if (!bytes.HasValue || bytes == 0) return "0 Bytes";
            string[] sizes = { "Bytes", "KB", "MB", "GB" };
            int i = (int)Math.Floor(Math.Log(bytes.Value) / Math.Log(1024));
            return Math.Round(bytes.Value / Math.Pow(1024, i), 2) + " " + sizes[i];
        }
    }
}