import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Report {
  id: number;
  memberId: number;
  memberName: string;
  memberDepartment: string;
  projectId: number;
  projectName: string;
  month: number;
  year: number;
  workDescription: string;
  hoursWorked: number;
  achievements?: string;
  challenges?: string;
  nextMonthPlans?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportDto {
  memberId: number;
  projectId: number;
  month: number;
  year: number;
  workDescription: string;
  hoursWorked: number;
  achievements?: string;
  challenges?: string;
  nextMonthPlans?: string;
}

export interface UpdateReportDto {
  workDescription: string;
  hoursWorked: number;
  achievements?: string;
  challenges?: string;
  nextMonthPlans?: string;
}

export interface ReportFilters {
  memberId?: number;
  projectId?: number;
  month?: number;
  year?: number;
  department?: string;
}

export interface ReportStatistics {
  period: string;
  summary: {
    totalReports: number;
    totalHours: number;
    activeMembers: number;
    activeProjects: number;
  };
  departmentStatistics: Array<{
    department: string;
    reportCount: number;
    totalHours: number;
    memberCount: number;
  }>;
  projectStatistics: Array<{
    projectId: number;
    projectName: string;
    reportCount: number;
    totalHours: number;
    contributorCount: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  async getReports(filters?: ReportFilters): Promise<Report[]> {
    try {
      let params = new HttpParams();

      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = (filters as any)[key];
          if (value !== null && value !== undefined && value !== '' && value !== 0) {
            params = params.set(key, value.toString());
          }
        });
      }

      const reports = await firstValueFrom(
        this.http.get<Report[]>(this.apiUrl, { params }).pipe(
          catchError(this.handleError)
        )
      );

      return reports.map(report => ({
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt)
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReport(id: number): Promise<Report> {
    try {
      const report = await firstValueFrom(
        this.http.get<Report>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt)
      };
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async createReport(report: CreateReportDto): Promise<Report> {
    try {
      const newReport = await firstValueFrom(
        this.http.post<Report>(this.apiUrl, report).pipe(
          catchError(this.handleError)
        )
      );

      return {
        ...newReport,
        createdAt: new Date(newReport.createdAt),
        updatedAt: new Date(newReport.updatedAt)
      };
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async updateReport(id: number, report: UpdateReportDto): Promise<void> {
    try {
      await firstValueFrom(
        this.http.put<void>(`${this.apiUrl}/${id}`, report).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: number): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async getStatistics(year?: number, month?: number): Promise<ReportStatistics> {
    try {
      let params = new HttpParams();

      if (year) {
        params = params.set('year', year.toString());
      }

      if (month) {
        params = params.set('month', month.toString());
      }

      return await firstValueFrom(
        this.http.get<ReportStatistics>(`${this.apiUrl}/statistics`, { params }).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
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
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict. The resource already exists.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
