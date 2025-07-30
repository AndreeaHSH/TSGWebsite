import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  department: Department;
  role: MemberRole;
  isActive: boolean;
  joinedAt: Date;
  linkedInUrl?: string;
  gitHubUrl?: string;
  imageUrl?: string;
  reportCount?: number;
  totalHours?: number;
  lastReportDate?: Date;
  activeProjects?: Array<{
    id: number;
    name: string;
    status: string;
  }>;
  currentMonthReports?: number;
}

export interface MemberDetails extends Member {
  statistics: {
    totalReports: number;
    totalHours: number;
    projectsWorkedOn: number;
    averageHoursPerMonth: number;
  };
  reports: Array<{
    id: number;
    month: number;
    year: number;
    workDescription: string;
    hoursWorked: number;
    achievements?: string;
    challenges?: string;
    nextMonthPlans?: string;
    createdAt: Date;
    project: {
      id: number;
      name: string;
      status: string;
    };
  }>;
  projectRoles: {
    responsibleFor: Array<{
      id: number;
      name: string;
      status: string;
    }>;
    executingProjects: Array<{
      id: number;
      name: string;
      status: string;
    }>;
    learningProjects: Array<{
      id: number;
      name: string;
      status: string;
    }>;
  };
}

export enum Department {
  Frontend = 'Frontend',
  Backend = 'Backend',
  Mobile = 'Mobile',
  Communication = 'Communication',
  Networking = 'Networking',
  GraphicDesign = 'GraphicDesign',
  FullStack = 'FullStack',
  Management = 'Management'
}

export enum MemberRole {
  Member = 'Member',
  Lead = 'Lead',
  Coordinator = 'Coordinator',
  Founder = 'Founder'
}

export interface MembersByDepartment {
  department: string;
  departmentDisplayName: string;
  members: Member[];
  memberCount: number;
}

export interface CreateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: Department;
  role: MemberRole;
  linkedInUrl?: string;
  gitHubUrl?: string;
  imageUrl?: string;
}

export interface UpdateMemberDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: Department;
  role: MemberRole;
  isActive: boolean;
  linkedInUrl?: string;
  gitHubUrl?: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/api/members`;

  constructor(private http: HttpClient) {}

  async getMembers(department?: Department, isActive?: boolean): Promise<Member[]> {
    try {
      let params = new HttpParams();
      if (department) {
        params = params.set('department', department);
      }
      if (isActive !== undefined) {
        params = params.set('isActive', isActive.toString());
      }

      const response$ = this.http.get<Member[]>(this.apiUrl, { params }).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting members:', error);
      throw error;
    }
  }

  async getMembersByDepartment(activeOnly: boolean = true): Promise<MembersByDepartment[]> {
    try {
      let params = new HttpParams();
      params = params.set('activeOnly', activeOnly.toString());

      const response$ = this.http.get<MembersByDepartment[]>(`${this.apiUrl}/by-department`, { params }).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting members by department:', error);
      throw error;
    }
  }

  async getMember(id: number): Promise<MemberDetails> {
    try {
      const response$ = this.http.get<MemberDetails>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting member:', error);
      throw error;
    }
  }

  async createMember(memberData: CreateMemberDto): Promise<Member> {
    try {
      const response$ = this.http.post<Member>(this.apiUrl, memberData).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  }

  async updateMember(id: number, memberData: UpdateMemberDto): Promise<void> {
    try {
      const response$ = this.http.put<void>(`${this.apiUrl}/${id}`, memberData).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  }

  async deleteMember(id: number): Promise<void> {
    try {
      const response$ = this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }

  async deactivateMember(id: number): Promise<void> {
    try {
      const response$ = this.http.post<void>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error deactivating member:', error);
      throw error;
    }
  }

  async activateMember(id: number): Promise<void> {
    try {
      const response$ = this.http.post<void>(`${this.apiUrl}/${id}/activate`, {}).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error activating member:', error);
      throw error;
    }
  }

  // Helper methods
  getDepartmentDisplayName(department: Department): string {
    const departmentNames: { [key in Department]: string } = {
      [Department.Frontend]: 'Front-end',
      [Department.Backend]: 'Back-end',
      [Department.Mobile]: 'Mobile',
      [Department.Communication]: 'Comunicare',
      [Department.Networking]: 'Networking',
      [Department.GraphicDesign]: 'Graphic Design',
      [Department.FullStack]: 'Full-stack',
      [Department.Management]: 'Management'
    };
    return departmentNames[department] || department;
  }

  getRoleDisplayName(role: MemberRole): string {
    const roleNames: { [key in MemberRole]: string } = {
      [MemberRole.Member]: 'Membru',
      [MemberRole.Lead]: 'Lead',
      [MemberRole.Coordinator]: 'Coordonator',
      [MemberRole.Founder]: 'Fondator'
    };
    return roleNames[role] || role;
  }

  getDepartmentColor(department: Department): string {
    const departmentColors: { [key in Department]: string } = {
      [Department.Management]: '#4F46E5',
      [Department.Frontend]: '#059669',
      [Department.Backend]: '#DC2626',
      [Department.FullStack]: '#7C3AED',
      [Department.Mobile]: '#0891B2',
      [Department.Communication]: '#EA580C',
      [Department.Networking]: '#65A30D',
      [Department.GraphicDesign]: '#C2410C'
    };
    return departmentColors[department] || '#6B7280';
  }

  getRoleColor(role: MemberRole): string {
    const roleColors: { [key in MemberRole]: string } = {
      [MemberRole.Founder]: '#7C3AED',
      [MemberRole.Coordinator]: '#DC2626',
      [MemberRole.Lead]: '#059669',
      [MemberRole.Member]: '#6B7280'
    };
    return roleColors[role] || '#6B7280';
  }

  getDepartmentOrder(department: Department): number {
    const order: { [key in Department]: number } = {
      [Department.Management]: 1,
      [Department.Frontend]: 2,
      [Department.Backend]: 3,
      [Department.FullStack]: 4,
      [Department.Mobile]: 5,
      [Department.Communication]: 6,
      [Department.Networking]: 7,
      [Department.GraphicDesign]: 8
    };
    return order[department] || 9;
  }

  getRoleOrder(role: MemberRole): number {
    const order: { [key in MemberRole]: number } = {
      [MemberRole.Founder]: 1,
      [MemberRole.Coordinator]: 2,
      [MemberRole.Lead]: 3,
      [MemberRole.Member]: 4
    };
    return order[role] || 5;
  }

  getMemberInitials(member: Member): string {
    return `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`.toUpperCase();
  }

  isMemberActive(member: Member): boolean {
    return member.isActive;
  }

  hasRecentActivity(member: Member): boolean {
    if (!member.lastReportDate) return false;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(member.lastReportDate) >= thirtyDaysAgo;
  }

  getMemberProductivity(member: Member): 'high' | 'medium' | 'low' {
    const totalHours = member.totalHours || 0;
    const reportCount = member.reportCount || 0;

    if (totalHours >= 80 && reportCount >= 3) return 'high';
    if (totalHours >= 40 && reportCount >= 2) return 'medium';
    return 'low';
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('40')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'A apărut o eroare necunoscută';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Eroare: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datele introduse sunt invalide';
          break;
        case 401:
          errorMessage = 'Nu sunteți autentificat';
          break;
        case 403:
          errorMessage = 'Nu aveți permisiunea să accesați această resursă';
          break;
        case 404:
          errorMessage = 'Membrul nu a fost găsit';
          break;
        case 409:
          errorMessage = 'Email-ul există deja în sistem';
          break;
        case 500:
          errorMessage = 'Eroare de server - încercați din nou mai târziu';
          break;
        default:
          errorMessage = `Cod eroare: ${error.status} - ${error.message}`;
      }
    }

    console.error('Member service error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}
