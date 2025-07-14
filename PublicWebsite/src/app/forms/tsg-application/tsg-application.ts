// src/app/forms/tsg-application/tsg-application.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { VolunteerService } from '../../services/volunteer';

@Component({
  selector: 'app-tsg-application',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './tsg-application.html',
  styleUrls: ['./tsg-application.scss'],
  animations: [
    trigger('slideInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out')
      ])
    ])
  ]
})
export class TsgApplicationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private volunteerService = inject(VolunteerService);
  private destroy$ = new Subject<void>();

  applicationForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  selectedFile: File | null = null;

  facultyOptions = [
    { value: 'design-produs-mediu', label: 'Design de produs și mediu' },
    { value: 'inginerie-electrica-calculatoare', label: 'Inginerie electrică și știința calculatoarelor' },
    { value: 'design-mobilier-lemn', label: 'Design de mobilier și ingineria lemnului' },
    { value: 'inginerie-mecanica', label: 'Inginerie mecanică' },
    { value: 'inginerie-tehnologica-management', label: 'Inginerie tehnologică și management industrial' },
    { value: 'silvicultura-exploatari', label: 'Silvicultură și exploatări forestiere' },
    { value: 'stiinta-ingineria-materialelor', label: 'Știința și ingineria materialelor' },
    { value: 'drept', label: 'Drept' },
    { value: 'educatie-fizica-sporturi', label: 'Educație fizică și sporturi montane' },
    { value: 'litere', label: 'Litere' },
    { value: 'matematica-informatica', label: 'Matematică și informatică' },
    { value: 'medicina', label: 'Medicină' },
    { value: 'muzica', label: 'Muzică' },
    { value: 'psihologie-stiinte-educatie', label: 'Psihologie și științele educației' },
    { value: 'sociologie-comunicare', label: 'Sociologie și comunicare' },
    { value: 'stiinte-economice-afaceri', label: 'Științe economice și administrarea afacerilor' },
    { value: 'alimentatie-turism', label: 'Alimentație și turism' },
    { value: 'constructii', label: 'Construcții' }
  ];

  yearOptions = [
    { value: '1', label: 'Anul I' },
    { value: '2', label: 'Anul II' },
    { value: '3', label: 'Anul III' },
    { value: '4', label: 'Anul IV' },
    { value: 'master1', label: 'Master I' },
    { value: 'master2', label: 'Master II' },
    { value: 'doctorat', label: 'Doctorat' }
  ];

  roleOptions = [
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Fullstack Developer', label: 'Fullstack Developer' },
    { value: 'Mobile Developer', label: 'Mobile Developer' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'QA Tester', label: 'QA Tester' },
    { value: 'Project Manager', label: 'Project Manager' },
    { value: 'Business Analyst', label: 'Business Analyst' },
    { value: 'Marketing Specialist', label: 'Marketing Specialist' },
    { value: 'Content Creator', label: 'Content Creator' },
    { value: 'HR Specialist', label: 'HR Specialist' }
  ];

  timeCommitmentOptions = [
    { value: '1-3 ore pe săptămână', label: '1-3 ore pe săptămână' },
    { value: '4-6 ore pe săptămână', label: '4-6 ore pe săptămână' },
    { value: '7-10 ore pe săptămână', label: '7-10 ore pe săptămână' },
    { value: 'Peste 10 ore pe săptămână', label: 'Peste 10 ore pe săptămână' },
    { value: 'Flexibil', label: 'Flexibil' }
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.applicationForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s\(\)]+$/)]],
      birthDate: ['', Validators.required],

      // Academic Information
      faculty: ['', Validators.required],
      specialization: ['', [Validators.required, Validators.minLength(2)]],
      studyYear: ['', Validators.required],
      studentId: [''],

      // Role Preferences
      preferredRole: ['', Validators.required],
      alternativeRole: [''],

      // Technical Skills
      programmingLanguages: [''],
      frameworks: [''],
      tools: [''],

      // Experience and Motivation
      experience: [''],
      motivation: ['', [Validators.required, Validators.minLength(100)]],
      contribution: ['', [Validators.required, Validators.minLength(50)]],

      // Availability
      timeCommitment: ['', Validators.required],
      schedule: [''],

      // Documents
      portfolioUrl: ['', Validators.pattern(/^https?:\/\/.+/)],

      // Agreements
      dataProcessingAgreement: [false, Validators.requiredTrue],
      termsAgreement: [false, Validators.requiredTrue]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Tip de fișier neacceptat. Vă rugăm să încărcați un fișier PDF, DOC sau DOCX.');
        input.value = '';
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fișierul este prea mare. Dimensiunea maximă permisă este 5MB.');
        input.value = '';
        return;
      }

      this.selectedFile = file;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Acest câmp este obligatoriu';
      }
      if (field.errors['email']) {
        return 'Adresa de email nu este validă';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `Minim ${requiredLength} caractere necesare`;
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Numărul de telefon nu este valid';
        }
        if (fieldName === 'portfolioUrl') {
          return 'URL-ul nu este valid (trebuie să înceapă cu http:// sau https://)';
        }
      }
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';

      try {
        const formData = new FormData();

        // Add form fields
        Object.keys(this.applicationForm.value).forEach(key => {
          const value = this.applicationForm.value[key];
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value.toString());
          }
        });

        // Add CV file if selected
        if (this.selectedFile) {
          formData.append('cvFile', this.selectedFile);
        }

        await this.volunteerService.submitApplication(formData).pipe(
          takeUntil(this.destroy$)
        ).toPromise();

        this.submitMessage = 'Aplicația a fost trimisă cu succes! Te vom contacta în cel mai scurt timp.';
        this.applicationForm.reset();
        this.selectedFile = null;

        // Reset file input
        const fileInput = document.getElementById('cv-file') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }

      } catch (error) {
        console.error('Error submitting application:', error);
        this.submitMessage = 'A apărut o eroare la trimiterea aplicației. Te rugăm să încerci din nou.';
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.applicationForm.controls).forEach(key => {
      this.applicationForm.get(key)?.markAsTouched();
    });
  }

  trackByValue(index: number, item: any): any {
    return item.value;
  }
}
