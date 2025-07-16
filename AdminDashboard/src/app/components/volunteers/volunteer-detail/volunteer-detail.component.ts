import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface VolunteerDetail {
  id: number;
  // Personal Information
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;

  // Academic Information
  faculty: string;
  specialization: string;
  studyYear: string;
  studentId: string;

  // Role Preferences
  preferredRole: string;
  alternativeRole: string;

  // Technical Skills
  programmingLanguages: string;
  frameworks: string;
  tools: string;

  // Experience and Motivation
  experience: string;
  motivation: string;
  contribution: string;

  // Availability
  timeCommitment: string;
  schedule: string;

  // Documents and Portfolio
  portfolioUrl: string;
  cvFileName: string;
  cvFileSize: number;

  // Agreements
  dataProcessingAgreement: boolean;
  termsAgreement: boolean;

  // Admin fields
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive';
  submittedAt: string;
  isFavorite: boolean;
  reviewNotes: string;
  reviewedAt?: string;
  contactedAt?: string;
  startedVolunteeringAt?: string;
  achievements?: string;
  volunteerHours: number;
  currentRole?: string;
}

@Component({
  selector: 'app-volunteer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volunteer-detail.component.html',
  styleUrls: ['./volunteer-detail.component.scss']
})
export class VolunteerDetailComponent implements OnInit {

  volunteer: VolunteerDetail | null = null;
  isLoading: boolean = true;
  volunteerId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.volunteerId = +params['id'];
      this.loadVolunteerDetails();
    });
  }

  // REAL API CALL - Replace mock data
  loadVolunteerDetails(): void {
    this.isLoading = true;

    this.http.get<VolunteerDetail>(`http://localhost:5193/api/volunteers/${this.volunteerId}`)
      .subscribe({
        next: (data) => {
          this.volunteer = {
            ...data,
            status: this.getStatusString(data.status as any)
          };
          this.isLoading = false;
          console.log('Loaded volunteer details:', this.volunteer);
        },
        error: (error) => {
          console.error('Error loading volunteer details:', error);
          this.isLoading = false;
          this.volunteer = null;
        }
      });
  }

  private getStatusString(status: any): 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive' {
    // Handle both string and number status values
    if (typeof status === 'number') {
      const statusMap: {[key: number]: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive'} = {
        0: 'Pending',
        1: 'Reviewed',
        2: 'Approved',
        3: 'Rejected',
        4: 'Contacted',
        5: 'Active',
        6: 'Inactive'
      };
      return statusMap[status] || 'Pending';
    }
    return status || 'Pending';
  }

  toggleFavorite(): void {
    if (this.volunteer) {
      this.http.put(`http://localhost:5193/api/volunteers/${this.volunteer.id}/favorite`, {})
        .subscribe({
          next: () => {
            if (this.volunteer) {
              this.volunteer.isFavorite = !this.volunteer.isFavorite;
              console.log(`Toggled favorite: ${this.volunteer.isFavorite}`);
            }
          },
          error: (error) => {
            console.error('Error toggling favorite:', error);
          }
        });
    }
  }

  downloadCV(): void {
    if (this.volunteer?.cvFileName) {
      this.http.get(`http://localhost:5193/api/volunteers/${this.volunteer.id}/cv`, {
        responseType: 'blob',
        observe: 'response'
      }).subscribe({
        next: (response) => {
          // Create blob URL and download
          const blob = response.body;
          if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.volunteer?.cvFileName || 'CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log(`Downloaded CV: ${this.volunteer?.cvFileName}`);
          }
        },
        error: (error) => {
          console.error('Error downloading CV:', error);
          if (error.status === 404) {
            alert('CV-ul nu a fost găsit pe server.');
          } else {
            alert('Eroare la descărcarea CV-ului. Încercați din nou.');
          }
        }
      });
    } else {
      alert('Nu există CV disponibil pentru descărcare.');
    }
  }

  downloadFullApplication(): void {
  if (this.volunteer) {
    this.http.get(`http://localhost:5193/api/volunteers/${this.volunteer.id}/download-pdf`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        // Create blob URL and download
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          // Extract filename from Content-Disposition header or create default
          const contentDisposition = response.headers.get('Content-Disposition');
          let filename = `Aplicatie_TSG_${this.volunteer?.firstName}_${this.volunteer?.lastName}_${Date.now()}.pdf`;

          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].replace(/['"]/g, '');
            }
          }

          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          console.log(`Downloaded full application PDF: ${filename}`);
        }
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        if (error.status === 404) {
          alert('Aplicația nu a fost găsită.');
        } else {
          alert('Eroare la descărcarea PDF-ului. Încercați din nou.');
        }
      }
    });
  } else {
    alert('Nu există aplicație disponibilă pentru descărcare.');
  }
}

  goBack(): void {
    this.router.navigate(['/aplicari']);
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Nu este specificată';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'Pending': 'În așteptare',
      'Reviewed': 'Revizuit',
      'Approved': 'Aprobat',
      'Rejected': 'Respins',
      'Contacted': 'Contactat',
      'Active': 'Activ',
      'Inactive': 'Inactiv'
    };
    return statusTexts[status] || status;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Reviewed': 'status-reviewed',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Contacted': 'status-contacted',
      'Active': 'status-active',
      'Inactive': 'status-inactive'
    };
    return statusClasses[status] || 'status-pending';
  }
}
