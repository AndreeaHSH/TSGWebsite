import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

interface VolunteerDetail {
  id: number;
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
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
  cvFilePath: string;
  cvFileSize: number;

  // Admin fields
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive';
  submittedAt: Date;
  isFavorite: boolean;
  reviewNotes: string;
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.volunteerId = +params['id'];
      this.loadVolunteerDetails();
    });
  }

  // Mock data - Replace with actual API call
  loadVolunteerDetails(): void {
    // For development: instant loading
    // setTimeout(() => {
      // Mock volunteer data
      this.volunteer = {
        id: this.volunteerId,
        firstName: 'Alexandru',
        lastName: 'Popescu',
        email: 'alex.popescu@student.unitbv.ro',
        phone: '0740123456',
        birthDate: new Date('2002-05-15'),
        age: 22,
        faculty: 'Facultatea de Matematică și Informatică',
        specialization: 'Informatică',
        studyYear: 'Anul 2',
        studentId: '20221234',
        preferredRole: 'Frontend Developer',
        alternativeRole: 'UI/UX Designer',
        programmingLanguages: 'JavaScript, TypeScript, Python, C++',
        frameworks: 'Angular, React, Vue.js, Express.js',
        tools: 'Git, Docker, Figma, VS Code, Postman',
        experience: 'Am lucrat la mai multe proiecte personale folosind React și Node.js. Am contribuit la câteva proiecte open-source pe GitHub și am participat la hackathon-uri locale.',
        motivation: 'Doresc să îmi dezvolt abilitățile tehnice într-un mediu real de lucru și să contribui la proiecte care au impact asupra comunității studențești. TSG oferă oportunitatea perfectă să învăț de la experți și să lucrez cu tehnologii moderne.',
        contribution: 'Pot contribui cu cunoștințele mele în dezvoltarea web, în special frontend. Am experiență cu design responsive și pot ajuta la îmbunătățirea experienței utilizatorului. De asemenea, sunt foarte motivat să învăț tehnologii noi.',
        timeCommitment: '10-15 ore pe săptămână',
        schedule: 'Luni-Vineri după orele 16:00, Weekend flexibil',
        portfolioUrl: 'https://github.com/alexpopescu',
        cvFileName: 'CV_Alexandru_Popescu.pdf',
        cvFilePath: '/uploads/cvs/cv_20240115_123456.pdf',
        cvFileSize: 245760, // bytes
        status: 'Pending',
        submittedAt: new Date('2024-01-15'),
        isFavorite: false,
        reviewNotes: ''
      };

      this.isLoading = false;
    // }, 300); // Commented out for instant loading
  }

  toggleFavorite(): void {
    if (this.volunteer) {
      this.volunteer.isFavorite = !this.volunteer.isFavorite;
      // TODO: Call API to update favorite status
      console.log(`Toggled favorite: ${this.volunteer.isFavorite}`);
    }
  }

  downloadCV(): void {
    if (this.volunteer?.cvFilePath) {
      // TODO: Implement actual CV download
      console.log(`Downloading CV: ${this.volunteer.cvFileName}`);
      alert(`Se descarcă CV-ul: ${this.volunteer.cvFileName}`);
    }
  }

  downloadFullApplication(): void {
    if (this.volunteer) {
      // TODO: Implement PDF generation and download
      console.log(`Downloading full application for: ${this.volunteer.firstName} ${this.volunteer.lastName}`);
      alert(`Se generează și descarcă aplicația completă pentru ${this.volunteer.firstName} ${this.volunteer.lastName}`);
    }
  }

  goBack(): void {
    this.router.navigate(['/aplicari']);
  }

  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
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
