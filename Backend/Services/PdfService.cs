using iTextSharp.text;
using iTextSharp.text.pdf;
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
                // Create document
                var document = new Document(PageSize.A4, 40, 40, 40, 40);
                var writer = PdfWriter.GetInstance(document, memoryStream);
                
                document.Open();

                // Fonts
                var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.DARK_GRAY);
                var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 14, new BaseColor(255, 109, 72)); // TSG Orange
                var labelFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);
                var valueFont = FontFactory.GetFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
                var smallFont = FontFactory.GetFont(FontFactory.HELVETICA, 8, BaseColor.GRAY);

                // Header with TSG branding
                var headerTable = new PdfPTable(2) { WidthPercentage = 100 };
                headerTable.SetWidths(new float[] { 1, 3 });

                // TSG Logo placeholder (you can add actual logo later)
                var logoCell = new PdfPCell(new Phrase("TSG", titleFont))
                {
                    Border = Rectangle.NO_BORDER,
                    HorizontalAlignment = Element.ALIGN_CENTER,
                    VerticalAlignment = Element.ALIGN_MIDDLE,
                    BackgroundColor = new BaseColor(255, 109, 72),
                    Padding = 10
                };
                headerTable.AddCell(logoCell);

                var titleCell = new PdfPCell(new Phrase("APLICATIE VOLUNTARIAT\nTRANSILVANIA STAR GROUP", titleFont))
                {
                    Border = Rectangle.NO_BORDER,
                    HorizontalAlignment = Element.ALIGN_LEFT,
                    VerticalAlignment = Element.ALIGN_MIDDLE,
                    Padding = 10
                };
                headerTable.AddCell(titleCell);

                document.Add(headerTable);
                document.Add(new Paragraph(" ")); // Space

                // Application metadata
                var metaTable = new PdfPTable(2) { WidthPercentage = 100 };
                metaTable.SetWidths(new float[] { 1, 1 });

                metaTable.AddCell(CreateInfoCell("Data aplicației:", volunteer.SubmittedAt.ToString("dd/MM/yyyy HH:mm"), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("ID Aplicație:", volunteer.Id.ToString(), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("Status:", GetStatusText(volunteer.Status), labelFont, valueFont));
                metaTable.AddCell(CreateInfoCell("Favorit:", volunteer.IsFavorite ? "Da" : "Nu", labelFont, valueFont));

                document.Add(metaTable);
                document.Add(new Paragraph(" "));

                // Personal Information Section
                AddSectionTitle(document, "INFORMAȚII PERSONALE", headerFont);
                var personalTable = new PdfPTable(2) { WidthPercentage = 100 };
                personalTable.SetWidths(new float[] { 1, 1 });

                personalTable.AddCell(CreateInfoCell("Nume:", volunteer.LastName, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Prenume:", volunteer.FirstName, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Email:", volunteer.Email, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Telefon:", volunteer.Phone, labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Data nașterii:", volunteer.BirthDate.ToString("dd/MM/yyyy"), labelFont, valueFont));
                personalTable.AddCell(CreateInfoCell("Vârsta:", $"{volunteer.Age} ani", labelFont, valueFont));

                document.Add(personalTable);
                document.Add(new Paragraph(" "));

                // Academic Information Section
                AddSectionTitle(document, "INFORMAȚII ACADEMICE", headerFont);
                var academicTable = new PdfPTable(2) { WidthPercentage = 100 };
                academicTable.SetWidths(new float[] { 1, 1 });

                academicTable.AddCell(CreateInfoCell("Facultatea:", volunteer.Faculty, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Specializarea:", volunteer.Specialization, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Anul de studiu:", volunteer.StudyYear, labelFont, valueFont));
                academicTable.AddCell(CreateInfoCell("Numărul de matricol:", volunteer.StudentId ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(academicTable);
                document.Add(new Paragraph(" "));

                // Role Preferences Section
                AddSectionTitle(document, "PREFERINȚE DE ROL", headerFont);
                var roleTable = new PdfPTable(1) { WidthPercentage = 100 };

                roleTable.AddCell(CreateInfoCell("Rolul preferat:", volunteer.PreferredRole, labelFont, valueFont));
                roleTable.AddCell(CreateInfoCell("Rol alternativ:", volunteer.AlternativeRole ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(roleTable);
                document.Add(new Paragraph(" "));

                // Technical Skills Section
                AddSectionTitle(document, "COMPETENȚE TEHNICE", headerFont);
                var skillsTable = new PdfPTable(1) { WidthPercentage = 100 };

                skillsTable.AddCell(CreateInfoCell("Limbaje de programare:", volunteer.ProgrammingLanguages ?? "Nu a fost specificat", labelFont, valueFont));
                skillsTable.AddCell(CreateInfoCell("Framework-uri:", volunteer.Frameworks ?? "Nu a fost specificat", labelFont, valueFont));
                skillsTable.AddCell(CreateInfoCell("Tools:", volunteer.Tools ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(skillsTable);
                document.Add(new Paragraph(" "));

                // Experience and Motivation Section
                AddSectionTitle(document, "EXPERIENȚĂ ȘI MOTIVAȚIE", headerFont);
                var experienceTable = new PdfPTable(1) { WidthPercentage = 100 };

                experienceTable.AddCell(CreateLongTextCell("Experiența anterioară:", volunteer.Experience ?? "Nu a fost specificată", labelFont, valueFont));
                experienceTable.AddCell(CreateLongTextCell("Motivația pentru TSG:", volunteer.Motivation, labelFont, valueFont));
                experienceTable.AddCell(CreateLongTextCell("Cum poate contribui:", volunteer.Contribution, labelFont, valueFont));

                document.Add(experienceTable);
                document.Add(new Paragraph(" "));

                // Availability Section
                AddSectionTitle(document, "DISPONIBILITATE", headerFont);
                var availabilityTable = new PdfPTable(2) { WidthPercentage = 100 };
                availabilityTable.SetWidths(new float[] { 1, 1 });

                availabilityTable.AddCell(CreateInfoCell("Timpul dedicat:", volunteer.TimeCommitment, labelFont, valueFont));
                availabilityTable.AddCell(CreateInfoCell("Program preferat:", volunteer.Schedule ?? "Nu a fost specificat", labelFont, valueFont));

                document.Add(availabilityTable);
                document.Add(new Paragraph(" "));

                // Documents and Portfolio Section
                AddSectionTitle(document, "DOCUMENTE ȘI PORTOFOLIU", headerFont);
                var documentsTable = new PdfPTable(1) { WidthPercentage = 100 };

                documentsTable.AddCell(CreateInfoCell("Portfolio/GitHub:", volunteer.PortfolioUrl ?? "Nu a fost specificat", labelFont, valueFont));
                documentsTable.AddCell(CreateInfoCell("CV:", !string.IsNullOrEmpty(volunteer.CvFileName) ? 
                    $"✓ {volunteer.CvFileName} ({FormatFileSize(volunteer.CvFileSize)})" : 
                    "Nu a fost încărcat CV", labelFont, valueFont));

                document.Add(documentsTable);
                document.Add(new Paragraph(" "));

                // Agreements Section
                AddSectionTitle(document, "ACORDURI ȘI CONSIMȚĂMINTE", headerFont);
                var agreementsTable = new PdfPTable(1) { WidthPercentage = 100 };

                agreementsTable.AddCell(CreateInfoCell("Acord prelucrare date:", volunteer.DataProcessingAgreement ? "✓ Acceptat" : "❌ Refuzat", labelFont, valueFont));
                agreementsTable.AddCell(CreateInfoCell("Acord termeni și condiții:", volunteer.TermsAgreement ? "✓ Acceptat" : "❌ Refuzat", labelFont, valueFont));

                document.Add(agreementsTable);
                document.Add(new Paragraph(" "));

                // Admin Section (if applicable)
                if (!string.IsNullOrEmpty(volunteer.ReviewNotes) || volunteer.ReviewedAt.HasValue)
                {
                    AddSectionTitle(document, "NOTIȚE ADMINISTRATIVE", headerFont);
                    var adminTable = new PdfPTable(1) { WidthPercentage = 100 };

                    if (volunteer.ReviewedAt.HasValue)
                        adminTable.AddCell(CreateInfoCell("Data revizuirii:", volunteer.ReviewedAt.Value.ToString("dd/MM/yyyy HH:mm"), labelFont, valueFont));
                    
                    if (!string.IsNullOrEmpty(volunteer.ReviewNotes))
                        adminTable.AddCell(CreateLongTextCell("Notițe admin:", volunteer.ReviewNotes, labelFont, valueFont));

                    document.Add(adminTable);
                }

                // Footer
                document.Add(new Paragraph(" "));
                var footer = new Paragraph($"Document generat automat • {DateTime.Now:dd/MM/yyyy HH:mm} • Transilvania Star Group", smallFont)
                {
                    Alignment = Element.ALIGN_CENTER
                };
                document.Add(footer);

                document.Close();
                return memoryStream.ToArray();
            }
        }

        private void AddSectionTitle(Document document, string title, Font font)
        {
            var titleParagraph = new Paragraph(title, font)
            {
                SpacingBefore = 10f,
                SpacingAfter = 10f
            };
            document.Add(titleParagraph);
        }

        private PdfPCell CreateInfoCell(string label, string value, Font labelFont, Font valueFont)
        {
            var cell = new PdfPCell();
            cell.Border = Rectangle.BOTTOM_BORDER;
            cell.BorderColor = BaseColor.LIGHT_GRAY;
            cell.Padding = 8f;

            var paragraph = new Paragraph();
            paragraph.Add(new Chunk(label + "\n", labelFont));
            paragraph.Add(new Chunk(value, valueFont));
            
            cell.AddElement(paragraph);
            return cell;
        }

        private PdfPCell CreateLongTextCell(string label, string value, Font labelFont, Font valueFont)
        {
            var cell = new PdfPCell();
            cell.Border = Rectangle.BOTTOM_BORDER;
            cell.BorderColor = BaseColor.LIGHT_GRAY;
            cell.Padding = 8f;
            cell.Colspan = 2; // Span across both columns

            var paragraph = new Paragraph();
            paragraph.Add(new Chunk(label + "\n", labelFont));
            paragraph.Add(new Chunk(value, valueFont));
            
            cell.AddElement(paragraph);
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