// PublicWebsite/src/app/forms/tsg-application/tsg-application.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
    ]),
    trigger('successNotification', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.3s ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(-20px)' }))
      ])
    ])
  ]
})
export class TsgApplicationComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private volunteerService = inject(VolunteerService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  applicationForm!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  selectedFile: File | null = null;
  showSuccessNotification = false;

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
    // Scroll to top when component initializes
    window.scrollTo({ top: 0, behavior: 'smooth' });

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

      // Terms
      termsAgreement: [false, Validators.requiredTrue],
      gdprAgreement: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';

      const formData = this.prepareFormData();

      this.volunteerService.submitApplication(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.handleSubmissionSuccess();
          },
          error: (error) => {
            this.handleSubmissionError(error);
          }
        });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private handleSubmissionSuccess(): void {
    this.isSubmitting = false;
    this.showSuccessNotification = true;

    // Scroll to top to show notification
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide notification and redirect after 4 seconds
    setTimeout(() => {
      this.showSuccessNotification = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 300); // Small delay for exit animation
    }, 4000);
  }

  private handleSubmissionError(error: any): void {
    this.isSubmitting = false;
    console.error('Submission error:', error);
    this.submitMessage = 'A apărut o eroare la trimiterea aplicației. Te rugăm să încerci din nou.';

    // Scroll to error message
    setTimeout(() => {
      const errorElement = document.querySelector('.submit-message.error');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const formValues = this.applicationForm.value;

    // Add all form fields to FormData
    Object.keys(formValues).forEach(key => {
      if (formValues[key] !== null && formValues[key] !== undefined) {
        formData.append(key, formValues[key]);
      }
    });

    // Add file if selected
    if (this.selectedFile) {
      formData.append('cv', this.selectedFile);
    }

    return formData;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        this.submitMessage = 'Te rugăm să încarci un fișier PDF.';
        event.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        this.submitMessage = 'Fișierul este prea mare. Dimensiunea maximă este 5MB.';
        event.target.value = '';
        return;
      }

      this.selectedFile = file;
      this.submitMessage = '';
    }
  }

  closeSuccessNotification(): void {
    this.showSuccessNotification = false;
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 300);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.applicationForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Acest câmp este obligatoriu.';
      if (field.errors['email']) return 'Te rugăm să introduci o adresă de email validă.';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractere.`;
      if (field.errors['pattern']) return 'Format invalid.';
    }
    return '';
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.applicationForm.controls).forEach(key => {
      this.applicationForm.get(key)?.markAsTouched();
    });
  }
}
