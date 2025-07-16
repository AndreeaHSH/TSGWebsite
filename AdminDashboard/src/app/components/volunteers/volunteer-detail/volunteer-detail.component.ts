import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { trigger, style, transition, animate } from '@angular/animations';

interface VolunteerDetail {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  age: number;
  faculty: string;
  specialization: string;
  studyYear: string;
  studentId: string;
  preferredRole: string;
  alternativeRole: string;
  programmingLanguages: string;
  frameworks: string;
  tools: string;
  experience: string;
  motivation: string;
  contribution: string;
  timeCommitment: string;
  schedule: string;
  portfolioUrl: string;
  cvFileName: string;
  cvFileSize: number;
  dataProcessingAgreement: boolean;
  termsAgreement: boolean;
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

interface StatusUpdate {
  status: number;
  reviewNotes?: string;
  contactedAt?: string;
  startedVolunteeringAt?: string;
  achievements?: string;
  volunteerHours?: number;
  currentRole?: string;
}

@Component({
  selector: 'app-volunteer-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer-detail.component.html',
  styleUrls: ['./volunteer-detail.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class VolunteerDetailComponent implements OnInit {
  volunteer: VolunteerDetail | null = null;
  isLoading = true;
  volunteerId = 0;

  isEditingStatus = false;
  selectedStatus = 'Pending';
  reviewNotes = '';
  currentRole = '';
  achievements = '';
  volunteerHours = 0;
  isUpdatingStatus = false;

  notification = {
    show: false,
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  };

  statusOptions = [
    { value: 'Pending', label: 'În așteptare', numValue: 0 },
    { value: 'Reviewed', label: 'Revizuit', numValue: 1 },
    { value: 'Approved', label: 'Aprobat', numValue: 2 },
    { value: 'Rejected', label: 'Respins', numValue: 3 },
    { value: 'Contacted', label: 'Contactat', numValue: 4 },
    { value: 'Active', label: 'Activ', numValue: 5 },
    { value: 'Inactive', label: 'Inactiv', numValue: 6 }
  ];

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

  loadVolunteerDetails(): void {
    this.isLoading = true;
    this.http.get<VolunteerDetail>(`http://localhost:5193/api/volunteers/${this.volunteerId}`)
      .subscribe({
        next: (data) => {
          this.volunteer = {
            ...data,
            status: this.getStatusString(data.status as any)
          };
          this.selectedStatus = this.volunteer.status;
          this.reviewNotes = this.volunteer.reviewNotes || '';
          this.currentRole = this.volunteer.currentRole || '';
          this.achievements = this.volunteer.achievements || '';
          this.volunteerHours = this.volunteer.volunteerHours || 0;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading volunteer details:', error);
          this.isLoading = false;
          this.volunteer = null;
        }
      });
  }

  private getStatusString(status: any): VolunteerDetail['status'] {
    const map: { [key: number]: VolunteerDetail['status'] } = {
      0: 'Pending',
      1: 'Reviewed',
      2: 'Approved',
      3: 'Rejected',
      4: 'Contacted',
      5: 'Active',
      6: 'Inactive'
    };
    return typeof status === 'number' ? (map[status] || 'Pending') : status;
  }

  startEditingStatus(): void {
    this.isEditingStatus = true;
  }

  cancelEditingStatus(): void {
    this.isEditingStatus = false;
    if (this.volunteer) {
      this.selectedStatus = this.volunteer.status;
      this.reviewNotes = this.volunteer.reviewNotes || '';
      this.currentRole = this.volunteer.currentRole || '';
      this.achievements = this.volunteer.achievements || '';
      this.volunteerHours = this.volunteer.volunteerHours || 0;
    }
  }

  updateVolunteerStatus(): void {
    if (!this.volunteer) return;
    this.isUpdatingStatus = true;

    const statusOption = this.statusOptions.find(opt => opt.value === this.selectedStatus);
    if (!statusOption) return;

    const statusUpdate: StatusUpdate = {
      status: statusOption.numValue,
      reviewNotes: this.reviewNotes.trim() || undefined,
      currentRole: this.currentRole.trim() || undefined,
      achievements: this.achievements.trim() || undefined,
      volunteerHours: this.volunteerHours > 0 ? this.volunteerHours : undefined
    };

    if (this.selectedStatus === 'Contacted') {
      statusUpdate.contactedAt = new Date().toISOString();
    } else if (this.selectedStatus === 'Active') {
      statusUpdate.startedVolunteeringAt = new Date().toISOString();
    }

    this.http.put(`http://localhost:5193/api/volunteers/${this.volunteer.id}/status`, statusUpdate)
      .subscribe({
        next: () => {
          this.volunteer = {
            ...this.volunteer!,
            status: this.selectedStatus as VolunteerDetail['status'],
            reviewNotes: this.reviewNotes,
            currentRole: this.currentRole,
            achievements: this.achievements,
            volunteerHours: this.volunteerHours,
            reviewedAt: new Date().toISOString()
          };
          this.isEditingStatus = false;
          this.isUpdatingStatus = false;
          this.showNotification('success', 'Succes!', 'Statusul a fost actualizat cu succes!');
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.isUpdatingStatus = false;
          this.showNotification('error', 'Eroare!', 'Nu s-a putut actualiza statusul.');
        }
      });
  }

  toggleFavorite(): void {
    if (!this.volunteer) return;
    this.http.put(`http://localhost:5193/api/volunteers/${this.volunteer.id}/favorite`, {})
      .subscribe({
        next: () => {
          this.volunteer!.isFavorite = !this.volunteer!.isFavorite;
          this.showNotification('success',
            this.volunteer!.isFavorite ? 'Favorit!' : 'Eliminat!',
            this.volunteer!.isFavorite ? 'Adăugat la favorite!' : 'Eliminat din favorite!'
          );
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
          this.showNotification('error', 'Eroare!', 'Nu s-a putut actualiza statusul de favorit.');
        }
      });
  }

  downloadApplicationPdf(): void {
    if (!this.volunteer) return;
    this.http.get(`http://localhost:5193/api/volunteers/${this.volunteer.id}/download-pdf`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Aplicatie_${this.volunteer!.firstName}_${this.volunteer!.lastName}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.showNotification('success', 'Descărcare completă!', 'Formularul a fost descărcat cu succes.');
        }
      },
      error: (error) => {
        console.error('Error downloading application PDF:', error);
        this.showNotification(
          error.status === 404 ? 'warning' : 'error',
          error.status === 404 ? 'Formular negăsit' : 'Eroare descărcare',
          error.status === 404 ? 'Nu s-a putut genera formularul PDF.' : 'Nu s-a putut descărca formularul.'
        );
      }
    });
  }

  downloadCV(): void {
    if (!this.volunteer?.cvFileName) {
      this.showNotification('warning', 'CV indisponibil', 'Nu există CV disponibil pentru descărcare.');
      return;
    }

    this.http.get(`http://localhost:5193/api/volunteers/${this.volunteer.id}/cv`, {
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.volunteer!.cvFileName || 'CV.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      },
      error: (error) => {
        console.error('Error downloading CV:', error);
        this.showNotification(
          error.status === 404 ? 'warning' : 'error',
          error.status === 404 ? 'CV negăsit' : 'Eroare descărcare',
          error.status === 404 ? 'CV-ul nu a fost găsit pe server.' : 'Nu s-a putut descărca CV-ul.'
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/aplicari']);
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'Pending': 'status-pending',
      'Reviewed': 'status-reviewed',
      'Approved': 'status-approved',
      'Rejected': 'status-rejected',
      'Contacted': 'status-contacted',
      'Active': 'status-active',
      'Inactive': 'status-inactive'
    };
    return classes[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'Pending': 'În așteptare',
      'Reviewed': 'Revizuit',
      'Approved': 'Aprobat',
      'Rejected': 'Respins',
      'Contacted': 'Contactat',
      'Active': 'Activ',
      'Inactive': 'Inactiv'
    };
    return texts[status] || status;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  private showNotification(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string): void {
    this.notification = { show: true, type, title, message };
    setTimeout(() => this.hideNotification(), 4000);
  }

  hideNotification(): void {
    this.notification.show = false;
  }
}
