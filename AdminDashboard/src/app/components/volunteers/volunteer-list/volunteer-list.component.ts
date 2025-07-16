import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Volunteer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  faculty: string;
  specialization: string;
  studyYear: string;
  preferredRole: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive';
  submittedAt: Date;
  isFavorite: boolean;
  hasCv: boolean;
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  // Mock data - Replace with actual API call
  loadVolunteers(): void {
    // For development: instant loading
    // setTimeout(() => {
      this.volunteers = [
        {
          id: 1,
          firstName: 'Alexandru',
          lastName: 'Popescu',
          email: 'alex.popescu@student.unitbv.ro',
          phone: '0740123456',
          faculty: 'Facultatea de Matematică și Informatică',
          specialization: 'Informatică',
          studyYear: 'Anul 2',
          preferredRole: 'Frontend Developer',
          status: 'Pending',
          submittedAt: new Date('2024-01-15'),
          isFavorite: false,
          hasCv: true
        },
        {
          id: 2,
          firstName: 'Maria',
          lastName: 'Ionescu',
          email: 'maria.ionescu@student.unitbv.ro',
          phone: '0741234567',
          faculty: 'Facultatea de Matematică și Informatică',
          specialization: 'Informatică',
          studyYear: 'Anul 3',
          preferredRole: 'UI/UX Designer',
          status: 'Reviewed',
          submittedAt: new Date('2024-01-14'),
          isFavorite: true,
          hasCv: true
        },
        {
          id: 3,
          firstName: 'Andrei',
          lastName: 'Vlaicu',
          email: 'andrei.vlaicu@student.unitbv.ro',
          phone: '0742345678',
          faculty: 'Facultatea de Electronică și Telecomunicații',
          specialization: 'Calculatoare',
          studyYear: 'Anul 1',
          preferredRole: 'Backend Developer',
          status: 'Approved',
          submittedAt: new Date('2024-01-13'),
          isFavorite: false,
          hasCv: false
        },
        {
          id: 4,
          firstName: 'Elena',
          lastName: 'Radu',
          email: 'elena.radu@student.unitbv.ro',
          phone: '0743456789',
          faculty: 'Facultatea de Matematică și Informatică',
          specialization: 'Informatică',
          studyYear: 'Anul 2',
          preferredRole: 'Mobile Developer',
          status: 'Contacted',
          submittedAt: new Date('2024-01-12'),
          isFavorite: true,
          hasCv: true
        },
        {
          id: 5,
          firstName: 'Mihai',
          lastName: 'Georgescu',
          email: 'mihai.georgescu@student.unitbv.ro',
          phone: '0744567890',
          faculty: 'Facultatea de Electronică și Telecomunicații',
          specialization: 'Rețele',
          studyYear: 'Anul 3',
          preferredRole: 'Network Engineer',
          status: 'Active',
          submittedAt: new Date('2024-01-11'),
          isFavorite: false,
          hasCv: true
        }
      ];

      this.filteredVolunteers = [...this.volunteers];
      this.isLoading = false;
    // }, 500); // Commented out for instant loading
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredVolunteers = [...this.volunteers];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredVolunteers = this.volunteers.filter(volunteer =>
      volunteer.firstName.toLowerCase().includes(term) ||
      volunteer.lastName.toLowerCase().includes(term) ||
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
    volunteer.isFavorite = !volunteer.isFavorite;
    // TODO: Call API to update favorite status
    console.log(`Toggled favorite for ${volunteer.firstName} ${volunteer.lastName}: ${volunteer.isFavorite}`);
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

  formatDate(date: Date): string {
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
