import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    university: string;
    faculty: string;
    year: string;
  };
  position: {
    selectedRole: string;
    motivation: string;
    experience: string;
  };
  skills: {
    technologies: string[];
    previousProjects: string;
    portfolio: string;
  };
  availability: {
    hoursPerWeek: string;
    startDate: string;
    duration: string;
  };
}

@Component({
  selector: 'app-tsg-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tsg-application.html',
  styleUrls: ['./tsg-application.scss']
})
export class TsgApplicationComponent implements OnInit {
  applicationForm: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  isSubmitting: boolean = false;

  availableRoles = [
    { value: 'frontend', label: 'Front End Developer' },
    { value: 'backend', label: 'Back End Developer' },
    { value: 'mobile', label: 'Mobile Developer (Flutter)' },
    { value: 'uiux', label: 'UI/UX & Web Designer' },
    { value: 'tester', label: 'Tester Automat/Manual' },
    { value: 'network', label: 'Network Engineer' },
    { value: 'hr', label: 'HR Specialist' }
  ];

  availableTechnologies = [
    'React', 'Vue', 'Angular', 'JavaScript', 'TypeScript', 'HTML/CSS',
    'Node.js', '.NET', 'C#', 'SQL Server', 'Flutter', 'Dart',
    'Figma', 'Adobe XD', 'WordPress', 'Photoshop',
    'Selenium', 'JUnit', 'TestNG', 'Postman',
    'Networking', 'Linux', 'Windows Server', 'Azure', 'AWS'
  ];

  universityYears = [
    { value: '1', label: 'Anul I' },
    { value: '2', label: 'Anul II' },
    { value: '3', label: 'Anul III' },
    { value: '4', label: 'Anul IV' },
    { value: 'master1', label: 'Master Anul I' },
    { value: 'master2', label: 'Master Anul II' },
    { value: 'phd', label: 'Doctorand' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.applicationForm = this.initializeForm();
  }

  ngOnInit(): void {
    // Initialize component
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      university: ['Universitatea Transilvania din Brașov', Validators.required],
      faculty: ['', Validators.required],
      year: ['', Validators.required],

      // Position Information
      selectedRole: ['', Validators.required],
      motivation: ['', [Validators.required, Validators.minLength(100)]],
      experience: ['', [Validators.required, Validators.minLength(50)]],

      // Skills Information
      technologies: [[], Validators.required],
      previousProjects: [''],
      portfolio: [''],

      // Availability Information
      hoursPerWeek: ['', Validators.required],
      startDate: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid()) {
      this.currentStep++;
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private isCurrentStepValid(): boolean {
    const currentStepFields = this.getCurrentStepFields();
    return currentStepFields.every(field =>
      this.applicationForm.get(field)?.valid || false
    );
  }

  private getCurrentStepFields(): string[] {
    switch (this.currentStep) {
      case 1:
        return ['firstName', 'lastName', 'email', 'phone', 'university', 'faculty', 'year'];
      case 2:
        return ['selectedRole', 'motivation', 'experience'];
      case 3:
        return ['technologies'];
      case 4:
        return ['hoursPerWeek', 'startDate', 'duration'];
      default:
        return [];
    }
  }

  private markCurrentStepAsTouched(): void {
    const currentStepFields = this.getCurrentStepFields();
    currentStepFields.forEach(field => {
      this.applicationForm.get(field)?.markAsTouched();
    });
  }

  onTechnologyChange(technology: string, event: any): void {
    const technologies = this.applicationForm.get('technologies')?.value || [];

    if (event.target.checked) {
      technologies.push(technology);
    } else {
      const index = technologies.indexOf(technology);
      if (index > -1) {
        technologies.splice(index, 1);
      }
    }

    this.applicationForm.patchValue({ technologies });
  }

  isTechnologySelected(technology: string): boolean {
    const technologies = this.applicationForm.get('technologies')?.value || [];
    return technologies.includes(technology);
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
        return `Minimum ${requiredLength} caractere necesare`;
      }
      if (field.errors['pattern']) {
        return 'Format invalid';
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.applicationForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  async onSubmit(): Promise<void> {
    if (this.applicationForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      try {
        const formData = this.prepareFormData();
        // Simulate API call
        await this.submitApplication(formData);

        // Show success message and redirect
        alert('Aplicația a fost trimisă cu succes! Vă vom contacta în curând.');
        this.router.navigate(['/']);

      } catch (error) {
        console.error('Submission error:', error);
        alert('A apărut o eroare la trimiterea aplicației. Vă rugăm să încercați din nou.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private prepareFormData(): FormData {
    const formValue = this.applicationForm.value;

    const formData: FormData = {
      personalInfo: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        university: formValue.university,
        faculty: formValue.faculty,
        year: formValue.year
      },
      position: {
        selectedRole: formValue.selectedRole,
        motivation: formValue.motivation,
        experience: formValue.experience
      },
      skills: {
        technologies: formValue.technologies,
        previousProjects: formValue.previousProjects,
        portfolio: formValue.portfolio
      },
      availability: {
        hoursPerWeek: formValue.hoursPerWeek,
        startDate: formValue.startDate,
        duration: formValue.duration
      }
    };

    return formData;
  }

  private async submitApplication(formData: FormData): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Here you would typically make an HTTP request to your backend
    console.log('Submitting application:', formData);

    // For now, just log the data and simulate success
    return Promise.resolve();
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.applicationForm.controls).forEach(key => {
      this.applicationForm.get(key)?.markAsTouched();
    });
  }

  onReset(): void {
    if (confirm('Sigur doriți să resetați formularul? Toate datele introduse vor fi pierdute.')) {
      this.applicationForm.reset();
      this.currentStep = 1;
    }
  }

  getProgressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
