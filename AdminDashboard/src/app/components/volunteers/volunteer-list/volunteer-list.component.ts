import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Volunteer {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  specialization: string;
  studyYear: string;
  preferredRole: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive';
  submittedAt: string;
  isFavorite: boolean;
  hasCv: boolean;
  currentRole?: string;
  volunteerHours: number;
  age: number;
}

@Component({
  selector: 'app-volunteer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer-list.component.html',
  styleUrls: ['./volunteer-list.component.scss']
})
export class VolunteerListComponent implements OnInit {

  volunteers: Volunteer[] = [];
  filteredVolunteers: Volunteer[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  // REAL API CALL - Replace mock data
  loadVolunteers(): void {
    this.isLoading = true;

    this.http.get<Volunteer[]>('http://localhost:5193/api/volunteers')
      .subscribe({
        next: (data) => {
          this.volunteers = data.map(volunteer => ({
            ...volunteer,
            submittedAt: volunteer.submittedAt,
            // Convert status number to string if needed
            status: this.getStatusString(volunteer.status as any)
          }));
          this.filteredVolunteers = [...this.volunteers];
          this.isLoading = false;
          console.log('Loaded volunteers:', this.volunteers);
        },
        error: (error) => {
          console.error('Error loading volunteers:', error);
          this.isLoading = false;
          // Fallback to empty array on error
          this.volunteers = [];
          this.filteredVolunteers = [];
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

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredVolunteers = [...this.volunteers];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredVolunteers = this.volunteers.filter(volunteer =>
      volunteer.fullName.toLowerCase().includes(term) ||
      volunteer.email.toLowerCase().includes(term) ||
      volunteer.faculty.toLowerCase().includes(term) ||
      volunteer.preferredRole.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredVolunteers = [...this.volunteers];
  }

  toggleFavorite(volunteer: Volunteer): void {
    // TODO: Call API to update favorite status
    this.http.put(`http://localhost:5193/api/volunteers/${volunteer.id}/favorite`, {})
      .subscribe({
        next: () => {
          volunteer.isFavorite = !volunteer.isFavorite;
          console.log(`Toggled favorite for ${volunteer.fullName}: ${volunteer.isFavorite}`);
        },
        error: (error) => {
          console.error('Error toggling favorite:', error);
        }
      });
  }

  viewVolunteerDetails(volunteerId: number): void {
    this.router.navigate(['/aplicari', volunteerId]);
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  trackByVolunteer(index: number, volunteer: Volunteer): number {
    return volunteer.id;
  }
}
