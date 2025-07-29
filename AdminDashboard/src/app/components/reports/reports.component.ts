// AdminDashboard/src/app/components/reports/reports.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, Report, ReportStatistics, ReportFilters } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // More efficient change detection
})
export class ReportsComponent implements OnInit {

  // Component properties
  reports: Report[] = [];
  filteredReports: Report[] = [];
  statistics: ReportStatistics | null = null;
  isLoading: boolean = true;
  activeTab: string = 'overview';

  // Available data for dropdowns
  members: any[] = [];
  projects: any[] = [];

  // Filters
  filters: ReportFilters = {
    year: new Date().getFullYear(),
    month: undefined,
    memberId: undefined,
    projectId: undefined,
    department: undefined
  };

  // Modal properties
  showReportModal: boolean = false;
  editingReport: Report | null = null;

  // Form data for new/edit report
  reportForm = {
    memberId: 1, // Default to first member
    projectId: 1, // Default to first project
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    workDescription: '',
    hoursWorked: 0,
    achievements: '',
    challenges: '',
    nextMonthPlans: ''
  };

  // Available options
  months = [
    { value: 1, name: 'Ianuarie' },
    { value: 2, name: 'Februarie' },
    { value: 3, name: 'Martie' },
    { value: 4, name: 'Aprilie' },
    { value: 5, name: 'Mai' },
    { value: 6, name: 'Iunie' },
    { value: 7, name: 'Iulie' },
    { value: 8, name: 'August' },
    { value: 9, name: 'Septembrie' },
    { value: 10, name: 'Octombrie' },
    { value: 11, name: 'Noiembrie' },
    { value: 12, name: 'Decembrie' }
  ];

  departments = ['Frontend', 'Backend', 'Mobile', 'Comunicare'];

  constructor(private reportService: ReportService) {}

  async ngOnInit(): Promise<void> {
    await this.loadMembers();
    await this.loadProjects();
    await this.loadReports();
    await this.loadStatistics();
  }

  // Tab management
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Data loading methods
  async loadMembers(): Promise<void> {
    try {
      // You'll need to implement getMembersList in the service
      // For now, create some dummy data
      this.members = [
        { id: 1, name: 'Test Member 1', department: 'Frontend' },
        { id: 2, name: 'Test Member 2', department: 'Backend' },
        { id: 3, name: 'Test Member 3', department: 'Mobile' }
      ];
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  async loadProjects(): Promise<void> {
    try {
      // You'll need to implement getProjectsList in the service
      // For now, create some dummy data
      this.projects = [
        { id: 1, name: 'Test Project 1' },
        { id: 2, name: 'Test Project 2' },
        { id: 3, name: 'Test Project 3' }
      ];
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  async loadReports(): Promise<void> {
    try {
      this.isLoading = true;
      this.reports = await this.reportService.getReports(this.filters);
      this.filteredReports = [...this.reports];
    } catch (error) {
      console.error('Error loading reports:', error);
      // Show user-friendly error message
      alert('Eroare la încărcarea rapoartelor. Verificați dacă serverul backend este pornit.');
    } finally {
      this.isLoading = false;
    }
  }

  async loadStatistics(): Promise<void> {
    try {
      this.statistics = await this.reportService.getStatistics(
        this.filters.year,
        this.filters.month
      );
    } catch (error) {
      console.error('Error loading statistics:', error);
      // Don't show error for statistics, just log it
    }
  }

  // Filter methods
  async applyFilters(): Promise<void> {
    await this.loadReports();
    await this.loadStatistics();
  }

  resetFilters(): void {
    this.filters = {
      year: new Date().getFullYear(),
      month: undefined,
      memberId: undefined,
      projectId: undefined,
      department: undefined
    };
    this.applyFilters();
  }

  // Modal methods
  openReportModal(report?: Report): void {
    this.showReportModal = true;
    if (report) {
      this.editingReport = report;
      this.reportForm = {
        memberId: report.memberId,
        projectId: report.projectId,
        month: report.month,
        year: report.year,
        workDescription: report.workDescription,
        hoursWorked: report.hoursWorked,
        achievements: report.achievements || '',
        challenges: report.challenges || '',
        nextMonthPlans: report.nextMonthPlans || ''
      };
    } else {
      this.editingReport = null;
      // Set valid default values
      this.reportForm = {
        memberId: 1, // Use valid member ID
        projectId: 1, // Use valid project ID
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        workDescription: '',
        hoursWorked: 1, // Set minimum valid hours
        achievements: '',
        challenges: '',
        nextMonthPlans: ''
      };
    }
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.editingReport = null;
  }

  async saveReport(): Promise<void> {
    try {
      // Add validation before sending
      if (!this.reportForm.workDescription.trim()) {
        alert('Descrierea muncii este obligatorie!');
        return;
      }

      if (this.reportForm.hoursWorked <= 0) {
        alert('Numărul de ore trebuie să fie mai mare decât 0!');
        return;
      }

      console.log('Saving report with data:', this.reportForm); // Debug log

      if (this.editingReport) {
        // Update existing report
        await this.reportService.updateReport(this.editingReport.id, {
          workDescription: this.reportForm.workDescription,
          hoursWorked: this.reportForm.hoursWorked,
          achievements: this.reportForm.achievements,
          challenges: this.reportForm.challenges,
          nextMonthPlans: this.reportForm.nextMonthPlans
        });
      } else {
        // Create new report
        console.log('Creating new report...'); // Debug log
        await this.reportService.createReport(this.reportForm);
      }

      this.closeReportModal();
      await this.loadReports();
      await this.loadStatistics();

      alert('Raportul a fost salvat cu succes!');
    } catch (error) {
      console.error('Error saving report:', error);
      // Show more detailed error message
      if (error instanceof Error) {
        alert(`Eroare la salvarea raportului: ${error.message}`);
      } else {
        alert('Eroare necunoscută la salvarea raportului');
      }
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    if (confirm('Ești sigur că vrei să ștergi acest raport?')) {
      try {
        await this.reportService.deleteReport(reportId);
        await this.loadReports();
        await this.loadStatistics();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  }

  // Utility methods
  openReportDetail(report: Report): void {
    // Show detailed view of report (you can implement a detail modal)
    console.log('Opening report detail:', report);
  }

  sortReports(field: keyof Report): void {
    this.filteredReports.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
  }

  getMonthName(month: number): string {
    const monthObj = this.months.find(m => m.value === month);
    return monthObj ? monthObj.name : `Luna ${month}`;
  }

  getDepartmentDisplayName(department: string): string {
    return department;
  }

  getDepartmentColor(department: string): string {
    const colors: { [key: string]: string } = {
      'Frontend': '#4CAF50',
      'Backend': '#2196F3',
      'Mobile': '#FF9800',
      'Comunicare': '#9C27B0'
    };
    return colors[department] || '#757575';
  }

  // Export functionality
  exportReports(): void {
    // Implement CSV/Excel export
    console.log('Exporting reports...');
    alert('Funcționalitatea de export va fi implementată în curând');
  }

  // Getter properties for better performance and null safety
  get departmentStats() {
    return this.statistics?.departmentStatistics || [];
  }

  get projectStats() {
    return this.statistics?.projectStatistics || [];
  }

  get hasDepartmentStats(): boolean {
    return this.departmentStats.length > 0;
  }

  get hasProjectStats(): boolean {
    return this.projectStats.length > 0;
  }

  // TrackBy functions for better *ngFor performance
  trackByReportId(index: number, report: Report): number {
    return report.id;
  }

  trackByDepartmentName(index: number, dept: any): string {
    return dept.department;
  }

  trackByProjectId(index: number, proj: any): number {
    return proj.projectId;
  }
}
