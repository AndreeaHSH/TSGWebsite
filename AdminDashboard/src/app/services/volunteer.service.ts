import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VolunteerListDto {
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

export interface VolunteerDetailDto {
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
  studentId?: string;

  // Role Preferences
  preferredRole: string;
  alternativeRole?: string;

  // Technical Skills
  programmingLanguages?: string;
  frameworks?: string;
  tools?: string;

  // Experience and Motivation
  experience?: string;
  motivation: string;
  contribution: string;

  // Availability
  timeCommitment: string;
  schedule?: string;

  // Documents and Portfolio
  portfolioUrl?: string;
  cvFileName?: string;
  cvFileSize?: number;

  // Agreements
  dataProcessingAgreement: boolean;
  termsAgreement: boolean;

  // Admin Fields
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Rejected' | 'Contacted' | 'Active' | 'Inactive';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
  isFavorite: boolean;
  favoritedAt?: string;
  contactedAt?: string;
  startedVolunteeringAt?: string;
  achievements?: string;
  volunteerHours: number;
  currentRole?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = environment.apiUrl + '/volunteers';
  private favoritesSubject = new BehaviorSubject<number[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all volunteers for admin list
  getVolunteers(): Observable<VolunteerListDto[]> {
    return this.http.get<VolunteerListDto[]>(this.apiUrl);
  }

  // Get volunteer details by ID
  getVolunteerById(id: number): Observable<VolunteerDetailDto> {
    return this.http.get<VolunteerDetailDto>(`${this.apiUrl}/${id}`);
  }

  // Toggle favorite status
  toggleFavorite(volunteerId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${volunteerId}/favorite`, {});
  }

  // Update volunteer status
  updateVolunteerStatus(volunteerId: number, status: string, notes?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${volunteerId}/status`, {
      status,
      reviewNotes: notes
    });
  }

  // Download CV
  downloadCV(volunteerId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${volunteerId}/cv`, {
      responseType: 'blob'
    });
  }

  // Get volunteer reports/statistics
  getVolunteerReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports`);
  }
}
