import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from './member.service';
import { Project } from './project.service';

export interface Report {
  id: number;
  memberId: number;
  projectId: number;
  month: number;
  year: number;
  workDescription: string;
  hoursWorked: number;
  achievements?: string;
  challenges?: string;
  nextMonthPlans?: string;
  createdAt: Date;
  updatedAt: Date;
  // Navigation properties
  member: Member;
  project: Project;
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
  year?: number;
  month?: number;
  memberId?: number;
  projectId?: number;
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

export interface MonthlyReportSummary {
  month: number;
  year: number;
  totalReports: number;
  totalHours: number;
  topContributors: Array<{
    memberId: number;
    memberName: string;
    totalHours: number;
    reportCount: number;
  }>;
  topProjects: Array<{
    projectId: number;
    projectName: string;
    totalHours: number;
    contributorCount: number;
  }>;
}

export interface ReportAnalytics {
  trends: {
    monthlyHours: Array<{
      month: string;
      hours: number;
      reports: number;
    }>;
    departmentDistribution: Array<{
      department: string;
      percentage: number;
      hours: number;
    }>;
    memberProductivity: Array<{
      memberId: number;
      memberName: string;
      averageHoursPerMonth: number;
      consistencyScore: number;
    }>;
  };
  insights: {
    mostActiveMonth: string;
    mostProductiveDepartment: string;
    averageHoursPerReport: number;
    reportCompletionRate: number;
  };
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
        if (filters.year) params = params.set('year', filters.year.toString());
        if (filters.month) params = params.set('month', filters.month.toString());
        if (filters.memberId) params = params.set('memberId', filters.memberId.toString());
        if (filters.projectId) params = params.set('projectId', filters.projectId.toString());
        if (filters.department) params = params.set('department', filters.department);
      }

      const response$ = this.http.get<Report[]>(this.apiUrl, { params }).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }

  async getReport(id: number): Promise<Report> {
    try {
      const response$ = this.http.get<Report>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting report:', error);
      throw error;
    }
  }

  async createReport(reportData: CreateReportDto): Promise<Report> {
    try {
      const response$ = this.http.post<Report>(this.apiUrl, reportData).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  async updateReport(id: number, reportData: UpdateReportDto): Promise<void> {
    try {
      const response$ = this.http.put<void>(`${this.apiUrl}/${id}`, reportData).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  }

  async deleteReport(id: number): Promise<void> {
    try {
      const response$ = this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
        catchError(this.handleError)
      );
      await firstValueFrom(response$);
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  async getStatistics(year?: number, month?: number): Promise<ReportStatistics> {
    try {
      let params = new HttpParams();
      if (year) params = params.set('year', year.toString());
      if (month) params = params.set('month', month.toString());

      const response$ = this.http.get<ReportStatistics>(`${this.apiUrl}/statistics`, { params }).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  async getMonthlyReports(year: number): Promise<MonthlyReportSummary[]> {
    try {
      const response$ = this.http.get<MonthlyReportSummary[]>(`${this.apiUrl}/monthly/${year}`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting monthly reports:', error);
      throw error;
    }
  }

  async getReportAnalytics(year: number): Promise<ReportAnalytics> {
    try {
      const response$ = this.http.get<ReportAnalytics>(`${this.apiUrl}/analytics/${year}`).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error getting report analytics:', error);
      throw error;
    }
  }

  async exportReports(filters?: ReportFilters, format: 'csv' | 'excel' = 'excel'): Promise<Blob> {
    try {
      let params = new HttpParams();
      params = params.set('format', format);

      if (filters) {
        if (filters.year) params = params.set('year', filters.year.toString());
        if (filters.month) params = params.set('month', filters.month.toString());
        if (filters.memberId) params = params.set('memberId', filters.memberId.toString());
        if (filters.projectId) params = params.set('projectId', filters.projectId.toString());
        if (filters.department) params = params.set('department', filters.department);
      }

      const response$ = this.http.get(`${this.apiUrl}/export`, {
        params,
        responseType: 'blob'
      }).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(response$);
    } catch (error) {
      console.error('Error exporting reports:', error);
      throw error;
    }
  }

  // Helper methods
  getMonthName(month: number): string {
    const monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    return monthNames[month - 1] || 'Necunoscut';
  }

  getMonthShortName(month: number): string {
    const monthShortNames = [
      'Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun',
      'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'
    ];
    return monthShortNames[month - 1] || 'Nec';
  }

  formatPeriod(month?: number, year?: number): string {
    if (month && year) {
      return `${this.getMonthName(month)} ${year}`;
    }
    if (year) {
      return year.toString();
    }
    return 'Toate perioadele';
  }

  validateReportData(reportData: CreateReportDto): string[] {
    const errors: string[] = [];

    if (!reportData.workDescription || reportData.workDescription.trim().length === 0) {
      errors.push('Descrierea muncii este obligatorie');
    }

    if (reportData.workDescription && reportData.workDescription.length > 2000) {
      errors.push('Descrierea muncii nu poate depăși 2000 de caractere');
    }

    if (reportData.hoursWorked < 0) {
      errors.push('Orele lucrate nu pot fi negative');
    }

    if (reportData.hoursWorked > 744) { // Max hours in a month
      errors.push('Orele lucrate nu pot depăși 744 ore pe lună');
    }

    if (reportData.month < 1 || reportData.month > 12) {
      errors.push('Luna trebuie să fie între 1 și 12');
    }

    if (reportData.year < 2020 || reportData.year > new Date().getFullYear() + 1) {
      errors.push('Anul nu este valid');
    }

    if (reportData.achievements && reportData.achievements.length > 1000) {
      errors.push('Realizările nu pot depăși 1000 de caractere');
    }

    if (reportData.challenges && reportData.challenges.length > 1000) {
      errors.push('Provocările nu pot depăși 1000 de caractere');
    }

    if (reportData.nextMonthPlans && reportData.nextMonthPlans.length > 1000) {
      errors.push('Planurile pentru luna următoare nu pot depăși 1000 de caractere');
    }

    return errors;
  }

  isReportOverdue(member: Member, currentMonth: number, currentYear: number): boolean {
    const lastReportDate = member.lastReportDate ? new Date(member.lastReportDate) : null;

    if (!lastReportDate) {
      return true; // No reports yet
    }

    const lastReportMonth = lastReportDate.getMonth() + 1;
    const lastReportYear = lastReportDate.getFullYear();

    // Check if report for current month is missing
    if (currentYear > lastReportYear) {
      return true;
    }

    if (currentYear === lastReportYear && currentMonth > lastReportMonth + 1) {
      return true;
    }

    return false;
  }

  calculateProductivityScore(reports: Report[]): number {
    if (reports.length === 0) return 0;

    const totalHours = reports.reduce((sum, report) => sum + report.hoursWorked, 0);
    const averageHours = totalHours / reports.length;
    const consistency = this.calculateConsistency(reports);
    const quality = this.calculateQualityScore(reports);

    // Weighted score: 40% hours, 30% consistency, 30% quality
    return Math.round((averageHours * 0.4) + (consistency * 0.3) + (quality * 0.3));
  }

  private calculateConsistency(reports: Report[]): number {
    if (reports.length < 2) return 100;

    const hoursArray = reports.map(r => r.hoursWorked);
    const mean = hoursArray.reduce((sum, hours) => sum + hours, 0) / hoursArray.length;
    const variance = hoursArray.reduce((sum, hours) => sum + Math.pow(hours - mean, 2), 0) / hoursArray.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    const maxStdDev = mean; // Assume max std dev equals mean
    const consistencyScore = Math.max(0, 100 - (standardDeviation / maxStdDev) * 100);

    return Math.round(consistencyScore);
  }

  private calculateQualityScore(reports: Report[]): number {
    if (reports.length === 0) return 0;

    let qualitySum = 0;

    reports.forEach(report => {
      let score = 0;

      // Work description quality (40% of quality score)
      if (report.workDescription && report.workDescription.length > 100) score += 40;
      else if (report.workDescription && report.workDescription.length > 50) score += 20;

      // Achievements (20% of quality score)
      if (report.achievements && report.achievements.length > 50) score += 20;
      else if (report.achievements && report.achievements.length > 0) score += 10;

      // Challenges (20% of quality score)
      if (report.challenges && report.challenges.length > 50) score += 20;
      else if (report.challenges && report.challenges.length > 0) score += 10;

      // Next month plans (20% of quality score)
      if (report.nextMonthPlans && report.nextMonthPlans.length > 50) score += 20;
      else if (report.nextMonthPlans && report.nextMonthPlans.length > 0) score += 10;

      qualitySum += score;
    });

    return Math.round(qualitySum / reports.length);
  }

  getReportCompleteness(report: Report): number {
    let completeness = 0;

    // Required fields (60%)
    if (report.workDescription && report.workDescription.length > 0) completeness += 30;
    if (report.hoursWorked > 0) completeness += 30;

    // Optional but important fields (40%)
    if (report.achievements && report.achievements.length > 0) completeness += 15;
    if (report.challenges && report.challenges.length > 0) completeness += 15;
    if (report.nextMonthPlans && report.nextMonthPlans.length > 0) completeness += 10;

    return Math.round(completeness);
  }

  generateReportSummary(report: Report): string {
    const summary = [];

    summary.push(`${report.hoursWorked} ore lucrate în ${this.getMonthName(report.month)} ${report.year}`);

    if (report.achievements) {
      summary.push(`Realizări: ${report.achievements.substring(0, 100)}${report.achievements.length > 100 ? '...' : ''}`);
    }

    if (report.challenges) {
      summary.push(`Provocări: ${report.challenges.substring(0, 100)}${report.challenges.length > 100 ? '...' : ''}`);
    }

    return summary.join('. ');
  }

  async downloadExportedFile(blob: Blob, filename: string): Promise<void> {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Eroare la descărcarea fișierului');
    }
  }

  formatHoursDisplay(hours: number): string {
    if (hours === 0) return '0 ore';
    if (hours === 1) return '1 oră';
    return `${hours} ore`;
  }

  getMonthsInYear(year: number): Array<{ value: number; name: string; isCurrentOrFuture?: boolean }> {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        value: month,
        name: this.getMonthName(month),
        isCurrentOrFuture: year > currentYear || (year === currentYear && month >= currentMonth)
      };
    });
  }

  getAvailableYears(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // TSG founding year
    const years: number[] = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
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
          errorMessage = 'Raportul nu a fost găsit';
          break;
        case 409:
          errorMessage = 'Există deja un raport pentru acest membru și proiect în această lună';
          break;
        case 422:
          errorMessage = 'Datele introduse nu sunt valide sau complete';
          break;
        case 500:
          errorMessage = 'Eroare de server - încercați din nou mai târziu';
          break;
        default:
          errorMessage = `Cod eroare: ${error.status} - ${error.message}`;
      }
    }

    console.error('Report service error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  };
}
