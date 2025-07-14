import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VolunteerService, VolunteerListDto } from '../../../services/volunteer.service';

@Component({
  selector: 'app-volunteer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './volunteer-list.component.html',
  styleUrls: ['./volunteer-list.component.scss']
})
export class VolunteerListComponent implements OnInit {

  volunteers: VolunteerListDto[] = [];
  filteredVolunteers: VolunteerListDto[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private router: Router,
    private volunteerService: VolunteerService
  ) {}

  ngOnInit(): void {
    this.loadVolunteers();
  }

  // Load volunteers from API
  loadVolunteers(): void {
    this.isLoading = true;
    this.error = '';

    this.volunteerService.getVolunteers().subscribe({
      next: (volunteers) => {
        this.volunteers = volunteers;
        this.filteredVolunteers = [...this.volunteers];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading volunteers:', error);
        this.error = 'Eroare la încărcarea aplicațiilor. Verificați conexiunea la server.';
        this.isLoading = false;

        // Fallback to mock data for development
        this.loadMockData();
      }
    });
  }

  // Fallback mock data for development
  private loadMockData(): void {
    this.volunteers = [
      {
        id: 1,
        fullName: 'Alexandru Popescu',
        firstName: 'Alexandru',
        lastName: 'Popescu',
        email: 'alex.popescu@student.unitbv.ro',
        phone: '0740123456',
        faculty: 'Facultatea de Matematică și Informatică',
        specialization: 'Informatică',
        studyYear: 'Anul 2',
        preferredRole: 'Frontend Developer',
        status: 'Pending',
        submittedAt: '2024-01-15T10:30:00Z',
        isFavorite: false,
        hasCv: true,
        volunteerHours: 0,
        age: 22
      },
      {
        id: 2,
        fullName: 'Maria Ionescu',
        firstName: 'Maria',
        lastName: 'Ionescu',
        email: 'maria.ionescu@student.unitbv.ro',
        phone: '0741234567',
        faculty: 'Facultatea de Matematică și Informatică',
        specialization: 'Informatică',
        studyYear: 'Anul 3',
        preferredRole: 'UI/UX Designer',
        status: 'Reviewed',
        submittedAt: '2024-01-14T09:15:00Z',
        isFavorite: true,
        hasCv: true,
        volunteerHours: 0,
        age: 23
      }
    ];

    this.filteredVolunteers = [...this.volunteers];
    this.error = 'Folosind date demo (nu s-a putut conecta la server)';
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

  toggleFavorite(volunteer: VolunteerListDto): void {
    this.volunteerService.toggleFavorite(volunteer.id).subscribe({
      next: () => {
        volunteer.isFavorite = !volunteer.isFavorite;
        console.log(`Toggled favorite for ${volunteer.fullName}: ${volunteer.isFavorite}`);
      },
      error: (error) => {
        console.error('Error toggling favorite:', error);
        // For development, still toggle locally if API fails
        volunteer.isFavorite = !volunteer.isFavorite;
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

  trackByVolunteer(index: number, volunteer: VolunteerListDto): number {
    return volunteer.id;
  }
}
