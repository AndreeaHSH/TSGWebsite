import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from './member.service';

export interface Project {
  id: number;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  repositoryUrl?: string;
  liveUrl?: string;
  responsibleMemberId: number;
  executorMemberId?: number;
  beginnerMemberId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectWithMembers extends Project {
  responsibleMember: Member;
  executorMember?: Member;
  beginnerMember?: Member;
  reportCount: number;
  lastReportDate?: Date;
}

export interface ProjectSummary {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsByStatus: Array<{
    status: string;
    count: number;
  }>;
  recentActivity: Array<{
    projectName: string;
    memberName: string;
    month: number;
    year: number;
    hoursWorked: number;
    createdAt: Date;
  }>;
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  repositoryUrl?: string;
  liveUrl?: string;
  responsibleMemberId: number;
  executorMemberId?: number;
  beginnerMemberId?: number;
}

export interface UpdateProjectDto {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  repositoryUrl?: string;
  liveUrl?: string;
  responsibleMemberId: number;
  executorMemberId?: number;
  beginnerMemberId?: number;
}

export enum ProjectStatus {
  Planning = 0,
  InProgress = 1,
  Testing = 2,
  Completed = 3,
  OnHold = 4,
  Cancelled = 5
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  async getProjects(): Promise<Project[]> {
    try {
      const response$ = this.http.get<Project[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async getProjectsWithMembers(): Promise<ProjectWithMembers[]> {
    try {
      const response$ = this.http.get<ProjectWithMembers[]>(this.apiUrl).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting projects with members:', error);
      throw error;
    }
  }

  async getProject(id: number): Promise<ProjectWithMembers> {
    try {
      const response$ = this.http.get<ProjectWithMembers>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    try {
      const response$ = this.http.post<Project>(this.apiUrl, projectData).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: number, projectData: UpdateProjectDto): Promise<void> {
    try {
      const response$ = this.http.put<void>(`${this.apiUrl}/${id}`, projectData).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const response$ = this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  async getProjectsSummary(): Promise<ProjectSummary> {
    try {
      const response$ = this.http.get<ProjectSummary>(`${this.apiUrl}/summary`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting projects summary:', error);
      throw error;
    }
  }

  // Helper methods
  getStatusDisplayName(status: ProjectStatus): string {
    const statusNames: { [key in ProjectStatus]: string } = {
      [ProjectStatus.Planning]: 'În planificare',
      [ProjectStatus.InProgress]: 'În desfășurare',
      [ProjectStatus.Testing]: 'În testare',
      [ProjectStatus.Completed]: 'Finalizat',
      [ProjectStatus.OnHold]: 'În așteptare',
      [ProjectStatus.Cancelled]: 'Anulat'
    };
    return statusNames[status] || 'Necunoscut';
  }

  getStatusColor(status: ProjectStatus): string {
    const statusColors: { [key in ProjectStatus]: string } = {
      [ProjectStatus.Planning]: '#6B7280',
      [ProjectStatus.InProgress]: '#059669',
      [ProjectStatus.Testing]: '#0891B2',
      [ProjectStatus.Completed]: '#10B981',
      [ProjectStatus.OnHold]: '#F59E0B',
      [ProjectStatus.Cancelled]: '#EF4444'
    };
    return statusColors[status] || '#6B7280';
  }

  isProjectActive(status: ProjectStatus): boolean {
    return status === ProjectStatus.InProgress || status === ProjectStatus.Testing;
  }

  isProjectCompleted(status: ProjectStatus): boolean {
    return status === ProjectStatus.Completed;
  }

  getProjectProgress(project: Project): number {
    switch (project.status) {
      case ProjectStatus.Planning:
        return 10;
      case ProjectStatus.InProgress:
        return 50;
      case ProjectStatus.Testing:
        return 80;
      case ProjectStatus.Completed:
        return 100;
      case ProjectStatus.OnHold:
        return 30;
      case ProjectStatus.Cancelled:
        return 0;
      default:
        return 0;
    }
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
          errorMessage = 'Proiectul nu a fost găsit';
          break;
        case 409:
          errorMessage = 'Conflicț de date - proiectul există deja';
          break;
        case 500:
          errorMessage = 'Eroare de server - încercați din nou mai târziu';
          break;
        default:
          errorMessage = `Cod eroare: ${error.status} - ${error.message}`;
      }
    }

    console.error('Project service error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}
