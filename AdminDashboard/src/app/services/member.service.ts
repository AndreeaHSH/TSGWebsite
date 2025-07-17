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

export interface MemberStatistics {
  totalActiveMembers: number;
  totalInactiveMembers: number;
  departmentStatistics: Array<{
    department: string;
    departmentDisplayName: string;
    count: number;
    percentage: number;
  }>;
  roleStatistics: Array<{
    role: string;
    roleDisplayName: string;
    count: number;
    percentage: number;
  }>;
  recentJoins: Member[];
}

export interface MemberSearchFilters {
  query?: string;
  department?: Department;
  role?: MemberRole;
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private apiUrl = `${environment.apiUrl}/api/members`;

  constructor(private http: HttpClient) {}

  /**
   * Get all members with optional filters
   */
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

  /**
   * Get a single member by ID
   */
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

  /**
   * Create a new member
   */
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

  /**
   * Update an existing member
   */
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

  /**
   * Delete a member (soft delete)
   */
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

  /**
   * Get members grouped by department
   */
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

  /**
   * Get member statistics
   */
  async getMemberStatistics(): Promise<MemberStatistics> {
    try {
      const stats = await firstValueFrom(
        this.http.get<MemberStatistics>(`${this.apiUrl}/statistics`).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...stats,
        recentJoins: stats.recentJoins.map(member => ({
          ...member,
          joinedAt: new Date(member.joinedAt)
        }))
      };
    } catch (error) {
      console.error('Error fetching member statistics:', error);
      throw error;
    }
  }

  /**
   * Search members with filters
   */
  async searchMembers(filters: MemberSearchFilters): Promise<Member[]> {
    try {
      let params = new HttpParams();

      if (filters.query) {
        params = params.set('query', filters.query);
      }

      if (filters.department) {
        params = params.set('department', filters.department);
      }

      if (filters.role) {
        params = params.set('role', filters.role);
      }

      if (filters.isActive !== undefined) {
        params = params.set('isActive', filters.isActive.toString());
      }

      const members = await firstValueFrom(
        this.http.get<Member[]>(`${this.apiUrl}/search`, { params }).pipe(
          catchError(this.handleError)
        )
      );

      return members.map(member => ({
        ...member,
        joinedAt: new Date(member.joinedAt)
      }));
    } catch (error) {
      console.error('Error searching members:', error);
      throw error;
    }
  }

  /**
   * Activate a member
   */
  async activateMember(id: number): Promise<{ message: string }> {
    try {
      return await firstValueFrom(
        this.http.put<{ message: string }>(`${this.apiUrl}/${id}/activate`, {}).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error activating member:', error);
      throw error;
    }
  }

  /**
   * Deactivate a member
   */
  async deactivateMember(id: number): Promise<{ message: string }> {
    try {
      return await firstValueFrom(
        this.http.put<{ message: string }>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error deactivating member:', error);
      throw error;
    }
  }

  /**
   * Get leads (Lead, Coordinator, Founder roles)
   */
  async getLeads(): Promise<Member[]> {
    try {
      const leads = await firstValueFrom(
        this.http.get<Member[]>(`${this.apiUrl}/leads`).pipe(
          catchError(this.handleError)
        )
      );

      return leads.map(member => ({
        ...member,
        joinedAt: new Date(member.joinedAt)
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  /**
   * Get available members for project assignment
   */
  async getAvailableMembers(): Promise<Member[]> {
    try {
      const members = await firstValueFrom(
        this.http.get<Member[]>(`${this.apiUrl}/available-for-projects`).pipe(
          catchError(this.handleError)
        )
      );

      return members.map(member => ({
        ...member,
        joinedAt: new Date(member.joinedAt)
      }));
    } catch (error) {
      console.error('Error fetching available members:', error);
      throw error;
    }
  }

  /**
   * Get department options for forms
   */
  getDepartmentOptions(): Array<{key: Department, value: string}> {
    return [
      { key: Department.Frontend, value: 'Frontend' },
      { key: Department.Backend, value: 'Backend' },
      { key: Department.Mobile, value: 'Mobile' },
      { key: Department.Communication, value: 'Communication' },
      { key: Department.Networking, value: 'Networking' },
      { key: Department.GraphicDesign, value: 'Graphic Design' },
      { key: Department.FullStack, value: 'Full Stack' },
      { key: Department.Management, value: 'Management' }
    ];
  }

  /**
   * Get role options for forms
   */
  getRoleOptions(): Array<{key: MemberRole, value: string}> {
    return [
      { key: MemberRole.Member, value: 'Member' },
      { key: MemberRole.Lead, value: 'Lead' },
      { key: MemberRole.Coordinator, value: 'Coordinator' },
      { key: MemberRole.Founder, value: 'Founder' }
    ];
  }

  /**
   * Get display name for department
   */
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

  /**
   * Get display name for role
   */
  getRoleDisplayName(role: MemberRole | string): string {
    const roleNames: { [key: string]: string } = {
      'Member': 'Member',
      'Lead': 'Lead',
      'Coordinator': 'Coordinator',
      'Founder': 'Founder'
    };
    return roleNames[role] || role;
  }

  /**
   * Get department color for UI
   */
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
      errorMessage = `Server Error Code: ${error.status}\nMessage: ${error.message}`;

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
