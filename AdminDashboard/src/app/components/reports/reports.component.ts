// AdminDashboard/src/app/components/reports/reports.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ProjectService } from '../../services/project.service';
import { MemberService } from '../../services/member.service';

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

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
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

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  isActive: boolean;
  joinedAt: Date;
  linkedInUrl?: string;
  gitHubUrl?: string;
  imageUrl?: string;
}

export interface MembersByDepartment {
  department: string;
  departmentDisplayName: string;
  members: Member[];
  memberCount: number;
}

export interface Statistics {
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

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // Data properties
  reports: Report[] = [];
  projects: Project[] = [];
  membersByDepartment: MembersByDepartment[] = [];
  allMembers: Member[] = [];

  // Form properties
  reportForm: FormGroup;
  projectForm: FormGroup;
  editingReport: Report | null = null;
  editingProject: Project | null = null;

  // Filter properties
  selectedDepartment: string = '';
  selectedMonth: number = new Date().getMonth() + 1;
  selectedYear: number = new Date().getFullYear();
  selectedProject: number = 0;
  selectedMember: number = 0;

  // UI state
  showReportModal = false;
  showProjectModal = false;
  showReportDetailModal = false;
  selectedReportDetail: Report | null = null;
  activeTab: 'overview' | 'members' | 'projects' | 'reports' = 'overview';
  isLoading = false;

  // Statistics
  statistics: Statistics | null = null;

  // Department enum mapping
  departments = [
    { key: '', value: 'Toate departamentele' },
    { key: 'Frontend', value: 'Frontend' },
    { key: 'Backend', value: 'Backend' },
    { key: 'Mobile', value: 'Mobile' },
    { key: 'Communication', value: 'Communication' },
    { key: 'Networking', value: 'Networking' },
    { key: 'GraphicDesign', value: 'Graphic Design' },
    { key: 'FullStack', value: 'Full Stack' },
    { key: 'Management', value: 'Management' }
  ];

  projectStatuses = [
    { key: 'Planning', value: 'Planning' },
    { key: 'InProgress', value: 'In Progress' },
    { key: 'Testing', value: 'Testing' },
    { key: 'Completed', value: 'Completed' },
    { key: 'OnHold', value: 'On Hold' },
    { key: 'Cancelled', value: 'Cancelled' }
  ];

  months = [
    { value: 0, name: 'Toate lunile' },
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

  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private projectService: ProjectService,
    private memberService: MemberService
  ) {
    this.reportForm = this.createReportForm();
    this.projectForm = this.createProjectForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private createReportForm(): FormGroup {
    return this.fb.group({
      memberId: ['', Validators.required],
      projectId: ['', Validators.required],
      month: [this.selectedMonth, Validators.required],
      year: [this.selectedYear, Validators.required],
      workDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      hoursWorked: [0, [Validators.required, Validators.min(1), Validators.max(168)]],
      achievements: ['', Validators.maxLength(1000)],
      challenges: ['', Validators.maxLength(1000)],
      nextMonthPlans: ['', Validators.maxLength(1000)]
    });
  }

  private createProjectForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      status: ['Planning', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      repositoryUrl: ['', Validators.maxLength(500)],
      liveUrl: ['', Validators.maxLength(500)],
      responsibleMemberId: ['', Validators.required],
      executorMemberId: [''],
      beginnerMemberId: ['']
    });
  }

  private async loadInitialData(): Promise<void> {
    this.isLoading = true;
    try {
      await Promise.all([
        this.loadMembers(),
        this.loadProjects(),
        this.loadReports(),
        this.loadStatistics()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadMembers(): Promise<void> {
    try {
      this.membersByDepartment = await this.memberService.getMembersByDepartment();
      this.allMembers = this.membersByDepartment.flatMap(dept => dept.members);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  }

  private async loadProjects(): Promise<void> {
    try {
      this.projects = await this.projectService.getProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  private async loadReports(): Promise<void> {
    try {
      const filters: any = {};
      if (this.selectedDepartment) filters.department = this.selectedDepartment;
      if (this.selectedMonth > 0) filters.month = this.selectedMonth;
      if (this.selectedYear) filters.year = this.selectedYear;
      if (this.selectedProject > 0) filters.projectId = this.selectedProject;
      if (this.selectedMember > 0) filters.memberId = this.selectedMember;

      this.reports = await this.reportService.getReports(filters);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }

  private async loadStatistics(): Promise<void> {
    try {
      const month = this.selectedMonth > 0 ? this.selectedMonth : undefined;
      this.statistics = await this.reportService.getStatistics(this.selectedYear, month);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  // Tab management
  setActiveTab(tab: 'overview' | 'members' | 'projects' | 'reports'): void {
    this.activeTab = tab;
    if (tab === 'reports') {
      this.loadReports();
    }
  }

  // Filter methods
  async onFilterChange(): Promise<void> {
    await this.loadReports();
    await this.loadStatistics();
  }

  clearFilters(): void {
    this.selectedDepartment = '';
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = new Date().getFullYear();
    this.selectedProject = 0;
    this.selectedMember = 0;
    this.onFilterChange();
  }

  // Report management
  openReportModal(report?: Report): void {
    this.editingReport = report || null;
    if (report) {
      this.reportForm.patchValue(report);
    } else {
      this.reportForm.reset();
      this.reportForm.patchValue({
        month: this.selectedMonth > 0 ? this.selectedMonth : new Date().getMonth() + 1,
        year: this.selectedYear,
        hoursWorked: 0
      });
    }
    this.showReportModal = true;
  }

  closeReportModal(): void {
    this.showReportModal = false;
    this.editingReport = null;
    this.reportForm.reset();
  }

  async submitReport(): Promise<void> {
    if (this.reportForm.valid) {
      try {
        const formData = this.reportForm.value;

        if (this.editingReport) {
          await this.reportService.updateReport(this.editingReport.id, formData);
        } else {
          await this.reportService.createReport(formData);
        }

        this.closeReportModal();
        await this.loadReports();
        await this.loadStatistics();
      } catch (error) {
        console.error('Error submitting report:', error);
        alert('Eroare la salvarea raportului. Verificați dacă nu există deja un raport pentru acest membru, proiect și perioadă.');
      }
    } else {
      this.markFormGroupTouched(this.reportForm);
    }
  }

  async deleteReport(reportId: number): Promise<void> {
    if (confirm('Sunteți sigur că doriți să ștergeți acest raport?')) {
      try {
        await this.reportService.deleteReport(reportId);
        await this.loadReports();
        await this.loadStatistics();
      } catch (error) {
        console.error('Error deleting report:', error);
        alert('Eroare la ștergerea raportului.');
      }
    }
  }

  // Project management
  openProjectModal(project?: Project): void {
    this.editingProject = project || null;
    if (project) {
      this.projectForm.patchValue({
        ...project,
        startDate: this.formatDate(project.startDate),
        endDate: project.endDate ? this.formatDate(project.endDate) : ''
      });
    } else {
      this.projectForm.reset();
      this.projectForm.patchValue({
        status: 'Planning',
        startDate: this.formatDate(new Date())
      });
    }
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
    this.editingProject = null;
    this.projectForm.reset();
  }

  async submitProject(): Promise<void> {
    if (this.projectForm.valid) {
      try {
        const formData = this.projectForm.value;

        if (this.editingProject) {
          await this.projectService.updateProject(this.editingProject.id, formData);
        } else {
          await this.projectService.createProject(formData);
        }

        this.closeProjectModal();
        await this.loadProjects();
      } catch (error) {
        console.error('Error submitting project:', error);
        alert('Eroare la salvarea proiectului.');
      }
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }

  async deleteProject(projectId: number): Promise<void> {
    if (confirm('Sunteți sigur că doriți să ștergeți acest proiect? Toate rapoartele asociate vor fi șterse.')) {
      try {
        await this.projectService.deleteProject(projectId);
        await this.loadProjects();
        await this.loadReports();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Eroare la ștergerea proiectului.');
      }
    }
  }

  // Report detail modal
  openReportDetail(report: Report): void {
    this.selectedReportDetail = report;
    this.showReportDetailModal = true;
  }

  closeReportDetail(): void {
    this.showReportDetailModal = false;
    this.selectedReportDetail = null;
  }

  // Utility methods
  getDepartmentColor(department: string): string {
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

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Planning': '#6c757d',
      'InProgress': '#007bff',
      'Testing': '#ffc107',
      'Completed': '#28a745',
      'OnHold': '#fd7e14',
      'Cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  }

  getStatusDisplayName(status: string): string {
    const statusNames: { [key: string]: string } = {
      'Planning': 'Planificare',
      'InProgress': 'În progres',
      'Testing': 'Testare',
      'Completed': 'Finalizat',
      'OnHold': 'Suspendat',
      'Cancelled': 'Anulat'
    };
    return statusNames[status] || status;
  }

  getDepartmentDisplayName(department: string): string {
    const deptNames: { [key: string]: string } = {
      'Frontend': 'Frontend',
      'Backend': 'Backend',
      'Mobile': 'Mobile',
      'GraphicDesign': 'Graphic Design',
      'Communication': 'Comunicare',
      'Networking': 'Networking',
      'FullStack': 'Full Stack',
      'Management': 'Management'
    };
    return deptNames[department] || department;
  }

  getMonthName(month: number): string {
    const monthObj = this.months.find(m => m.value === month);
    return monthObj ? monthObj.name : month.toString();
  }

  formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toISOString().split('T')[0];
  }

  formatDateTime(date: Date | string): string {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date.toLocaleDateString('ro-RO') + ' ' + date.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  }

  getMembersBySelectedDepartment(): Member[] {
    if (!this.selectedDepartment) {
      return this.allMembers;
    }
    const dept = this.membersByDepartment.find(d => d.department === this.selectedDepartment);
    return dept ? dept.members : [];
  }

  getProjectsByStatus(status: string): Project[] {
    return this.projects.filter(p => p.status === status);
  }

  getReportsByMember(memberId: number): Report[] {
    return this.reports.filter(r => r.memberId === memberId);
  }

  getTotalHoursByMember(memberId: number): number {
    return this.getReportsByMember(memberId).reduce((sum, r) => sum + r.hoursWorked, 0);
  }

  isFormFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'Acest câmp este obligatoriu';
      if (field.errors['maxlength']) return `Maximul permis: ${field.errors['maxlength'].requiredLength} caractere`;
      if (field.errors['min']) return `Valoarea minimă: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valoarea maximă: ${field.errors['max'].max}`;
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Export functionality
  exportReports(): void {
    const csvContent = this.convertReportsToCSV();
    this.downloadCSV(csvContent, `rapoarte_${this.selectedYear}_${this.selectedMonth || 'toate'}.csv`);
  }

  private convertReportsToCSV(): string {
    const headers = ['Membru', 'Departament', 'Proiect', 'Luna', 'An', 'Ore lucrate', 'Descriere', 'Realizări', 'Provocări', 'Planuri'];
    const rows = this.reports.map(report => [
      report.memberName,
      this.getDepartmentDisplayName(report.memberDepartment),
      report.projectName,
      this.getMonthName(report.month),
      report.year.toString(),
      report.hoursWorked.toString(),
      `"${report.workDescription.replace(/"/g, '""')}"`,
      `"${(report.achievements || '').replace(/"/g, '""')}"`,
      `"${(report.challenges || '').replace(/"/g, '""')}"`,
      `"${(report.nextMonthPlans || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Sorting
  sortReports(key: keyof Report): void {
    this.reports.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
  }

  sortProjects(key: keyof Project): void {
    this.projects.sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
      return 0;
    });
  }
}
