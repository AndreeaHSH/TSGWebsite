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

      const members = await firstValueFrom(
        this.http.get<Member[]>(this.apiUrl, { params }).pipe(
          catchError(this.handleError)
        )
      );

      return members.map(member => ({
        ...member,
        joinedAt: new Date(member.joinedAt)
      }));
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  }

  async getMember(id: number): Promise<Member> {
    try {
      const member = await firstValueFrom(
        this.http.get<Member>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...member,
        joinedAt: new Date(member.joinedAt)
      };
    } catch (error) {
      console.error('Error fetching member:', error);
      throw error;
    }
  }

  async createMember(member: CreateMemberDto): Promise<Member> {
    try {
      const newMember = await firstValueFrom(
        this.http.post<Member>(this.apiUrl, member).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...newMember,
        joinedAt: new Date(newMember.joinedAt)
      };
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  }

  async updateMember(id: number, member: UpdateMemberDto): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put<void>(`${this.apiUrl}/${id}`, member).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error updating member:', error);
      throw error;
    }
  }

  async deleteMember(id: number): Promise<{ message: string }> {
    try {
      return await firstValueFrom(
        this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error deleting member:', error);
      throw error;
    }
  }

  async getMembersByDepartment(): Promise<MembersByDepartment[]> {
    try {
      const departments = await firstValueFrom(
        this.http.get<MembersByDepartment[]>(`${this.apiUrl}/by-department`).pipe(
          catchError(this.handleError)
        )
      );

      return departments.map(dept => ({
        ...dept,
        members: dept.members.map(member => ({
          ...member,
          joinedAt: new Date(member.joinedAt)
        }))
      }));
    } catch (error) {
      console.error('Error fetching members by department:', error);
      throw error;
    }
  }

  getDepartmentDisplayName(department: Department | string): string {
    const deptNames: { [key: string]: string } = {
      'Frontend': 'Frontend',
      'Backend': 'Backend',
      'Mobile': 'Mobile',
      'GraphicDesign': 'Graphic Design',
      'Communication': 'Communication',
      'Networking': 'Networking',
      'FullStack': 'Full Stack',
      'Management': 'Management'
    };
    return deptNames[department] || department;
  }

  getDepartmentColor(department: Department | string): string {
    const colors: { [key: string]: string } = {
      'Frontend': '#61dafb',
      'Backend': '#68217a',
      'Mobile': '#44c0c7',
      'GraphicDesign': '#ff6b6b',
      'Communication': '#e74c3c',
      'Networking': '#2c3e50',
      'FullStack': '#9b59b6',
      'Management': '#f39c12'
    };
    return colors[department] || '#6c757d';
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Member not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict. A member with this email already exists.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
