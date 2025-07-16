// AdminDashboard/src/app/services/volunteer/volunteer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VolunteerListDto {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  faculty: string;
  specialization: string;
  studyYear: string;
  preferredRole: string;
  status: VolunteerStatus;
  submittedAt: string;
  isFavorite: boolean;
  hasCv: boolean;
  currentRole?: string;
  volunteerHours: number;
  age: number;
}

export interface VolunteerDetailDto {
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
  studentId?: string;
  preferredRole: string;
  alternativeRole?: string;
  programmingLanguages?: string;
  frameworks?: string;
  tools?: string;
  experience?: string;
  motivation: string;
  contribution: string;
  timeCommitment: string;
  schedule?: string;
  portfolioUrl?: string;
  cvFileName?: string;
  cvFileSize?: number;
  dataProcessingAgreement: boolean;
  termsAgreement: boolean;
  status: VolunteerStatus;
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

export interface VolunteerStatusUpdateDto {
  status: VolunteerStatus;
  reviewNotes?: string;
  contactedAt?: string;
  startedVolunteeringAt?: string;
  achievements?: string;
  volunteerHours?: number;
  currentRole?: string;
}

export enum VolunteerStatus {
  Pending = 0,
  Reviewed = 1,
  Approved = 2,
  Rejected = 3,
  Contacted = 4,
  Active = 5,
  Inactive = 6
}

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = `${environment.apiUrl}/volunteers`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getVolunteers(): Observable<VolunteerListDto[]> {
    return this.http.get<VolunteerListDto[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getVolunteer(id: number): Observable<VolunteerDetailDto> {
    return this.http.get<VolunteerDetailDto>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateVolunteerStatus(id: number, statusUpdate: VolunteerStatusUpdateDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, statusUpdate, {
      headers: this.getAuthHeaders()
    });
  }

  toggleFavorite(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/favorite`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  downloadCv(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/cv`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }

  getVolunteerReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports`, {
      headers: this.getAuthHeaders()
    });
  }
}
