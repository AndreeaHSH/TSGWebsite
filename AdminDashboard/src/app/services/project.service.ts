import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

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
  responsibleMemberName: string;
  executorMemberId?: number;
  executorMemberName?: string;
  beginnerMemberId?: number;
  beginnerMemberName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  Planning = 'Planning',
  InProgress = 'InProgress',
  Testing = 'Testing',
  Completed = 'Completed',
  OnHold = 'OnHold',
  Cancelled = 'Cancelled'
}

export interface CreateProjectDto {
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
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
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  repositoryUrl?: string;
  liveUrl?: string;
  responsibleMemberId: number;
  executorMemberId?: number;
  beginnerMemberId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) {}

  /**
   * Get all projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      const projects = await firstValueFrom(
        this.http.get<Project[]>(this.apiUrl).pipe(
          catchError(this.handleError)
        )
      );

      return projects.map(project => ({
        ...project,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : undefined,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<Project> {
    try {
      const project = await firstValueFrom(
        this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...project,
        startDate: new Date(project.startDate),
        endDate: project.endDate ? new Date(project.endDate) : undefined,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(project: CreateProjectDto): Promise<Project> {
    try {
      const newProject = await firstValueFrom(
        this.http.post<Project>(this.apiUrl, project).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...newProject,
        startDate: new Date(newProject.startDate),
        endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
        createdAt: new Date(newProject.createdAt),
        updatedAt: new Date(newProject.updatedAt)
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(id: number, project: UpdateProjectDto): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put<void>(`${this.apiUrl}/${id}`, project).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  /**
   * Get projects by status
   */
  async getProjectsByStatus(status: ProjectStatus): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter(p => p.status === status);
  }

  /**
   * Get active projects (not completed or cancelled)
   */
  async getActiveProjects(): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter(p =>
      p.status !== ProjectStatus.Completed &&
      p.status !== ProjectStatus.Cancelled
    );
  }

  /**
   * Get projects by member (any role)
   */
  async getProjectsByMember(memberId: number): Promise<Project[]> {
    const projects = await this.getProjects();
    return projects.filter(p =>
      p.responsibleMemberId === memberId ||
      p.executorMemberId === memberId ||
      p.beginnerMemberId === memberId
    );
  }

  /**
   * Get project status options for forms
   */
  getProjectStatusOptions(): Array<{key: ProjectStatus, value: string}> {
    return [
      { key: ProjectStatus.Planning, value: 'Planificare' },
      { key: ProjectStatus.InProgress, value: 'În progres' },
      { key: ProjectStatus.Testing, value: 'Testare' },
      { key: ProjectStatus.Completed, value: 'Finalizat' },
      { key: ProjectStatus.OnHold, value: 'Suspendat' },
      { key: ProjectStatus.Cancelled, value: 'Anulat' }
    ];
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
          errorMessage = 'Project not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict. A project with this name already exists.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
