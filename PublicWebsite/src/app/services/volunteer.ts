import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VolunteerApplication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
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
  dataProcessingAgreement: boolean;
  termsAgreement: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  private apiUrl = 'http://localhost:5193/api/volunteers'; // Update with your actual port

  constructor(private http: HttpClient) {}

  submitApplication(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
