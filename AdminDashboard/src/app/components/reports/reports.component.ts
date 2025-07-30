import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  executorMemberId?: number;
  beginnerMemberId?: number;
  responsibleMember?: Member;
  executorMember?: Member;
  beginnerMember?: Member;
}

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

export interface DepartmentData {
  department: string;
  departmentDisplayName: string;
  Members: Member[];
  members?: Member[];
  memberCount: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent implements OnInit {
  // View state
  activeView: 'departments' | 'projects' | 'reports' = 'departments';
  isLoading = true;
  isSubmitting = false;

  // Data
  departmentData: DepartmentData[] = [];
  allMembers: Member[] = [];
  projects: Project[] = [];
  reports: Report[] = [];

  // Modals
  showMemberModal = false;
  showProjectModal = false;
  showReportModal = false;
  showReportDetailsModal = false;
  editingMember: Member | null = null;
  editingProject: Project | null = null;
  editingReport: Report | null = null;
  selectedMember: Member | null = null;
  viewingReport: Report | null = null;

  // Forms
  memberForm!: FormGroup;
  projectForm!: FormGroup;
  reportForm!: FormGroup;

  // Filters
  selectedYear = new Date().getFullYear();
  selectedMonth: number | string = '';
  selectedDepartment = '';

  // Constants
  departments = [
    { key: 'Management', display: 'Management' },
    { key: 'Frontend', display: 'Front-end' },
    { key: 'Backend', display: 'Back-end' },
    { key: 'FullStack', display: 'Full-stack' },
    { key: 'Mobile', display: 'Mobile' },
    { key: 'Communication', display: 'Comunicare' },
    { key: 'Networking', display: 'Networking' },
    { key: 'GraphicDesign', display: 'Graphic Design' }
  ];

  months = [
    { value: 1, name: 'Ianuarie' }, { value: 2, name: 'Februarie' }, { value: 3, name: 'Martie' },
    { value: 4, name: 'Aprilie' }, { value: 5, name: 'Mai' }, { value: 6, name: 'Iunie' },
    { value: 7, name: 'Iulie' }, { value: 8, name: 'August' }, { value: 9, name: 'Septembrie' },
    { value: 10, name: 'Octombrie' }, { value: 11, name: 'Noiembrie' }, { value: 12, name: 'Decembrie' }
  ];

  availableYears = [2025, 2024, 2023, 2022, 2021, 2020];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.initializeForms();
  }

  async ngOnInit() {
    await this.loadInitialData();
  }

  private initializeForms() {
    this.memberForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', Validators.maxLength(20)],
      department: ['', Validators.required],
      role: ['', Validators.required],
      isActive: [true],
      linkedInUrl: ['', Validators.maxLength(500)],
      gitHubUrl: ['', Validators.maxLength(500)]
    });

    this.projectForm = this.fb.group({
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

    this.reportForm = this.fb.group({
      memberId: ['', Validators.required],
      projectId: ['', Validators.required],
      month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      year: [new Date().getFullYear(), [Validators.required, Validators.min(2020)]],
      workDescription: ['', [Validators.required, Validators.maxLength(2000)]],
      hoursWorked: [0, [Validators.required, Validators.min(0), Validators.max(200)]],
      achievements: ['', Validators.maxLength(1000)],
      challenges: ['', Validators.maxLength(1000)],
      nextMonthPlans: ['', Validators.maxLength(1000)]
    });
  }

  private async loadInitialData() {
    try {
      this.isLoading = true;
      await Promise.all([
        this.loadDepartmentData(),
        this.loadProjects()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      alert('Eroare la încărcarea datelor. Verificați conexiunea la server.');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async loadDepartmentData() {
    try {
      const response = await firstValueFrom(
        this.http.get<DepartmentData[]>(`${environment.apiUrl}/api/members/by-department`)
      );

      console.log('Department data response:', response);

      this.departmentData = response || [];
      this.allMembers = this.departmentData.flatMap(dept => dept.Members || dept.members || []);
    } catch (error) {
      console.error('Error loading department data:', error);
      this.departmentData = [];
      this.allMembers = [];
    }
  }

  private async loadProjects() {
    try {
      const response = await firstValueFrom(
        this.http.get<Project[]>(`${environment.apiUrl}/api/projects`)
      );
      this.projects = response || [];

      this.projects.forEach(project => {
        project.responsibleMember = this.allMembers.find(m => m.id === project.responsibleMemberId);
        project.executorMember = this.allMembers.find(m => m.id === project.executorMemberId);
        project.beginnerMember = this.allMembers.find(m => m.id === project.beginnerMemberId);
      });
    } catch (error) {
      console.error('Error loading projects:', error);
      this.projects = [];
    }
  }

  async loadReports() {
    try {
      let url = `${environment.apiUrl}/api/reports?year=${this.selectedYear}`;

      if (this.selectedMonth) {
        url += `&month=${this.selectedMonth}`;
      }

      if (this.selectedDepartment) {
        url += `&department=${this.selectedDepartment}`;
      }

      const response = await firstValueFrom(
        this.http.get<Report[]>(url)
      );
      this.reports = response || [];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading reports:', error);
      this.reports = [];
    }
  }

  async setActiveView(view: 'departments' | 'projects' | 'reports') {
    this.activeView = view;

    if (view === 'reports') {
      await this.loadReports();
    }

    this.cdr.detectChanges();
  }

  openMemberModal(member?: Member | undefined, department?: string) {
    this.editingMember = member || null;

    if (member) {
      this.memberForm.patchValue({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone || '',
        department: member.department,
        role: member.role,
        isActive: member.isActive,
        linkedInUrl: member.linkedInUrl || '',
        gitHubUrl: member.gitHubUrl || ''
      });
    } else {
      this.memberForm.reset({
        department: department || '',
        role: 'Member',
        isActive: true
      });
    }

    this.showMemberModal = true;
    this.cdr.detectChanges();
  }

  closeMemberModal() {
    this.showMemberModal = false;
    this.editingMember = null;
    this.memberForm.reset();
    this.cdr.detectChanges();
  }

  async saveMember() {
    if (this.memberForm.invalid) {
      this.markFormGroupTouched(this.memberForm);
      return;
    }

    try {
      this.isSubmitting = true;
      const formData = this.memberForm.value;

      if (this.editingMember) {
        await firstValueFrom(
          this.http.put(`${environment.apiUrl}/api/members/${this.editingMember.id}`, formData)
        );
      } else {
        await firstValueFrom(
          this.http.post(`${environment.apiUrl}/api/members`, formData)
        );
      }

      await this.loadDepartmentData();
      this.closeMemberModal();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Eroare la salvarea membrului. Verificați datele introduse.');
    } finally {
      this.isSubmitting = false;
    }
  }

  async toggleMemberStatus(member: Member) {
    try {
      const action = member.isActive ? 'deactivate' : 'activate';
      await firstValueFrom(
        this.http.put(`${environment.apiUrl}/api/members/${member.id}/${action}`, {})
      );

      await this.loadDepartmentData();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error toggling member status:', error);
      alert('Eroare la schimbarea statusului membrului.');
    }
  }

  openProjectModal(project?: Project) {
    this.editingProject = project || null;

    if (project) {
      this.projectForm.patchValue({
        name: project.name,
        description: project.description,
        status: project.status,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
        repositoryUrl: project.repositoryUrl || '',
        liveUrl: project.liveUrl || '',
        responsibleMemberId: project.responsibleMemberId || '',
        executorMemberId: project.executorMemberId || '',
        beginnerMemberId: project.beginnerMemberId || ''
      });
    } else {
      this.projectForm.reset({
        status: 'Planning'
      });
    }

    this.showProjectModal = true;
    this.cdr.detectChanges();
  }

  closeProjectModal() {
    this.showProjectModal = false;
    this.editingProject = null;
    this.projectForm.reset();
    this.cdr.detectChanges();
  }

  async saveProject() {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }

    try {
      this.isSubmitting = true;
      const formData = this.projectForm.value;

      const projectData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        responsibleMemberId: parseInt(formData.responsibleMemberId),
        executorMemberId: formData.executorMemberId ? parseInt(formData.executorMemberId) : undefined,
        beginnerMemberId: formData.beginnerMemberId ? parseInt(formData.beginnerMemberId) : undefined
      };

      if (this.editingProject) {
        await firstValueFrom(
          this.http.put(`${environment.apiUrl}/api/projects/${this.editingProject.id}`, projectData)
        );
      } else {
        await firstValueFrom(
          this.http.post(`${environment.apiUrl}/api/projects`, projectData)
        );
      }

      await this.loadProjects();
      this.closeProjectModal();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Eroare la salvarea proiectului. Verificați datele introduse.');
    } finally {
      this.isSubmitting = false;
    }
  }

  async deleteProject(project: Project) {
    if (!confirm(`Sunteți sigur că doriți să ștergeți proiectul "${project.name}"?`)) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/api/projects/${project.id}`)
      );

      await this.loadProjects();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Eroare la ștergerea proiectului.');
    }
  }

  // Report management
  openReportModal(member: Member, report?: Report) {
    this.selectedMember = member;
    this.editingReport = report || null;

    if (report) {
      this.reportForm.patchValue({
        memberId: report.memberId,
        projectId: report.projectId,
        month: report.month,
        year: report.year,
        workDescription: report.workDescription,
        hoursWorked: report.hoursWorked,
        achievements: report.achievements || '',
        challenges: report.challenges || '',
        nextMonthPlans: report.nextMonthPlans || ''
      });
    } else {
      this.reportForm.patchValue({
        memberId: member.id,
        projectId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        workDescription: '',
        hoursWorked: 0,
        achievements: '',
        challenges: '',
        nextMonthPlans: ''
      });
    }

    this.showReportModal = true;
    this.cdr.detectChanges();
  }

  closeReportModal() {
    this.showReportModal = false;
    this.selectedMember = null;
    this.editingReport = null;
    this.reportForm.reset();
    this.cdr.detectChanges();
  }

  async saveReport() {
    if (this.reportForm.invalid) {
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    try {
      this.isSubmitting = true;
      const formData = this.reportForm.value;

      if (this.editingReport) {
        await firstValueFrom(
          this.http.put(`${environment.apiUrl}/api/reports/${this.editingReport.id}`, formData)
        );
      } else {
        await firstValueFrom(
          this.http.post(`${environment.apiUrl}/api/reports`, formData)
        );
      }

      if (this.activeView === 'reports') {
        await this.loadReports();
      }

      this.closeReportModal();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Eroare la salvarea raportului.');
    } finally {
      this.isSubmitting = false;
    }
  }

  viewReportDetails(report: Report) {
    this.viewingReport = report;
    this.showReportDetailsModal = true;
    this.cdr.detectChanges();
  }

  closeReportDetailsModal() {
    this.showReportDetailsModal = false;
    this.viewingReport = null;
    this.cdr.detectChanges();
  }

  editReport(report: Report) {
    this.closeReportDetailsModal();
    const member = this.allMembers.find(m => m.id === report.memberId);
    if (member) {
      this.openReportModal(member, report);
    }
  }

  async deleteReport(report: Report) {
    if (!confirm(`Sunteți sigur că doriți să ștergeți acest raport?`)) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.delete(`${environment.apiUrl}/api/reports/${report.id}`)
      );

      await this.loadReports();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Eroare la ștergerea raportului.');
    }
  }

  async exportReports() {
    try {
      let url = `${environment.apiUrl}/api/reports/export?year=${this.selectedYear}&format=excel`;

      if (this.selectedMonth) {
        url += `&month=${this.selectedMonth}`;
      }

      if (this.selectedDepartment) {
        url += `&department=${this.selectedDepartment}`;
      }

      const response = await firstValueFrom(
        this.http.get(url, { responseType: 'blob' })
      );

      if (response) {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        const url2 = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url2;

        const filename = `rapoarte_${this.selectedYear}${this.selectedMonth ? '_' + this.getMonthName(+this.selectedMonth) : ''}.xlsx`;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url2);
      }
    } catch (error) {
      console.error('Error exporting reports:', error);
      alert('Eroare la exportul rapoartelor.');
    }
  }

  resetFilters() {
    this.selectedYear = new Date().getFullYear();
    this.selectedMonth = '';
    this.selectedDepartment = '';
    this.loadReports();
  }

  getMemberProjects(member: Member | null): Project[] {
    if (!member) return [];

    return this.projects.filter(project =>
      project.responsibleMemberId === member.id ||
      project.executorMemberId === member.id ||
      project.beginnerMemberId === member.id
    );
  }

  getDepartmentColor(department: string): string {
    const colors: { [key: string]: string } = {
      'Management': '#4F46E5',
      'Frontend': '#059669',
      'Backend': '#DC2626',
      'FullStack': '#7C3AED',
      'Mobile': '#0891B2',
      'Communication': '#EA580C',
      'Networking': '#65A30D',
      'GraphicDesign': '#C2410C'
    };
    return colors[department] || '#6B7280';
  }

  getDepartmentDisplay(department: string): string {
    return this.departments.find(d => d.key === department)?.display || department;
  }

  getRoleDisplay(role: string): string {
    const roles: { [key: string]: string } = {
      'Member': 'Membru',
      'Lead': 'Lead',
      'Coordinator': 'Coordonator',
      'Founder': 'Fondator'
    };
    return roles[role] || role;
  }

  getStatusDisplay(status: string): string {
    const statuses: { [key: string]: string } = {
      'Planning': 'În planificare',
      'InProgress': 'În desfășurare',
      'Testing': 'În testare',
      'Completed': 'Finalizat',
      'OnHold': 'În așteptare',
      'Cancelled': 'Anulat'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Planning': '#6B7280',
      'InProgress': '#059669',
      'Testing': '#0891B2',
      'Completed': '#10B981',
      'OnHold': '#F59E0B',
      'Cancelled': '#EF4444'
    };
    return colors[status] || '#6B7280';
  }

  getMonthName(month: number): string {
    return this.months.find(m => m.value === month)?.name || month.toString();
  }

  getMemberInitials(fullName: string): string {
    const names = fullName.split(' ');
    return names.length >= 2 ?
      names[0].charAt(0) + names[names.length - 1].charAt(0) :
      fullName.charAt(0);
  }

  getTotalHours(): number {
    return this.reports.reduce((sum, report) => sum + report.hoursWorked, 0);
  }

  getActiveMembersCount(): number {
    const uniqueMembers = new Set(this.reports.map(r => r.memberId));
    return uniqueMembers.size;
  }

  getActiveProjectsCount(): number {
    const uniqueProjects = new Set(this.reports.map(r => r.projectId));
    return uniqueProjects.size;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  trackByDepartment(index: number, item: DepartmentData): string {
    return item.department;
  }

  trackByMember(index: number, item: Member): number {
    return item.id;
  }

  trackByProject(index: number, item: Project): number {
    return item.id;
  }

  trackByReport(index: number, item: Report): number {
    return item.id;
  }
}
