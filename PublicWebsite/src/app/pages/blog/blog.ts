// src/app/pages/blog/blog.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: Date;
  tags: string[];
  imageUrl?: string;
  isFeatured?: boolean;
  readTime?: number;
}

interface BlogCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
  slug: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './blog.html',
  styleUrls: ['./blog.scss'],
  animations: [
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s ease-out')
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class BlogComponent implements OnInit {
  newsletterForm!: FormGroup;
  isSubscribing: boolean = false;

  featuredPost: BlogPost = {
    id: 'featured-opportunities',
    title: 'Oportunități de dezvoltare pentru studenții IT',
    excerpt: 'Grupul TSG oferă studenților pasionați de domeniul IT spațiul în care aceștia își pot pune în aplicare abilitățile și ideile. Totodată, scopul lor este de a crea cât mai multe oportunități de dezvoltare pentru studenții de la cât mai multe facultăți și specializări. Prin intermediul proiectelor noastre, studenții au șansa să lucreze cu tehnologii moderne, să-și dezvolte competențele tehnice și să contribuie la digitalizarea proceselor universitare.',
    date: new Date('2025-04-03'),
    tags: ['Studenți', 'IT', 'Dezvoltare', 'Oportunități'],
    imageUrl: 'https://tsg.unitbv.ro/wp-content/uploads/2025/04/WhatsApp-Image-2025-04-03-at-12.45.58.jpeg',
    isFeatured: true,
    readTime: 3
  };

  blogPosts: BlogPost[] = [
    {
      id: 'student-app-launch',
      title: 'Lansarea aplicației Student@UNITBV 2.0',
      excerpt: 'Am lansat oficial noua versiune a aplicației mobile Student@UNITBV cu funcționalități îmbunătățite și o interfață complet redesignată pentru o experiență utilizator optimizată.',
      date: new Date('2025-03-15'),
      tags: ['Mobile App', 'Update', 'UI/UX'],
      readTime: 3
    },
    {
      id: 'digital-processes',
      title: 'Cum digitalizăm procesele universitare',
      excerpt: 'Explorăm metodologiile și tehnologiile pe care le folosim pentru a transforma procesele birocratice tradiționale în soluții digitale eficiente și user-friendly.',
      date: new Date('2025-02-28'),
      tags: ['Digitalizare', 'Procese', 'Eficiență'],
      readTime: 3
    },
    {
      id: 'modern-tech-stack',
      title: 'Tehnologii moderne în dezvoltarea web',
      excerpt: 'O privire asupra stack-ului tehnologic pe care îl folosim în proiectele TSG: React, .NET, Flutter și cum acestea ne ajută să construim aplicații robuste și scalabile.',
      date: new Date('2025-02-10'),
      tags: ['React', '.NET', 'Flutter', 'Tech Stack'],
      readTime: 3
    },
    {
      id: 'recruitment-2025',
      title: 'Recruitment TSG 2025 - Alătură-te echipei!',
      excerpt: 'Începem un nou ciclu de recrutare pentru anul 2025. Căutăm studenți motivați în toate domeniile IT: development, design, testing, networking și marketing digital.',
      date: new Date('2025-01-25'),
      tags: ['Recrutare', 'Voluntariat', 'Echipă'],
      readTime: 3
    },
    {
      id: 'year-2024-retrospective',
      title: 'Retrospectiva anului 2024',
      excerpt: 'Un an plin de realizări: 5 proiecte majore finalizate, 3 site-uri web lansate, 25+ studenți noi în echipă și sute de studenți care beneficiază de soluțiile noastre digitale.',
      date: new Date('2025-01-10'),
      tags: ['Retrospectivă', 'Realizări', '2024'],
      readTime: 3
    },
    {
      id: 'open-source-contribution',
      title: 'Contribuția open source și dezvoltarea comunității',
      excerpt: 'Cum TSG contribuie la ecosistemul open source și construiește o comunitate de dezvoltatori studenți în România prin mentorat și partajarea cunoștințelor.',
      date: new Date('2024-12-15'),
      tags: ['Open Source', 'Comunitate', 'Mentorat'],
      readTime: 3
    }
  ];

  categories: BlogCategory[] = [
    {
      id: 'development',
      name: 'Dezvoltare',
      icon: '💻',
      count: 12,
      slug: 'dezvoltare'
    },
    {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      icon: '📱',
      count: 8,
      slug: 'mobile-apps'
    },
    {
      id: 'design',
      name: 'Design',
      icon: '🎨',
      count: 6,
      slug: 'design'
    },
    {
      id: 'projects',
      name: 'Proiecte',
      icon: '🚀',
      count: 15,
      slug: 'proiecte'
    },
    {
      id: 'team',
      name: 'Echipă',
      icon: '👥',
      count: 10,
      slug: 'echipa'
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      icon: '🎯',
      count: 20,
      slug: 'tutorial'
    }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.newsletterForm = this.initializeNewsletterForm();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private initializeNewsletterForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      agreeToPrivacy: [false, Validators.requiredTrue]
    });
  }

  formatDate(date: Date): string {
    const months = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  getReadTime(post: BlogPost): string {
    return `${post.readTime || 3} min read`;
  }

  onImageError(event: any): void {
    // Handle image loading errors
    event.target.style.display = 'none';
    console.warn('Failed to load blog post image:', event.target.src);
  }

  onCategoryClick(category: BlogCategory): void {
    // Navigate to category filtered view
    console.log('Navigating to category:', category.slug);
    // This would typically navigate to a filtered view
  }

  async onNewsletterSubmit(): Promise<void> {
    if (this.newsletterForm.valid && !this.isSubscribing) {
      this.isSubscribing = true;

      try {
        const formData = this.newsletterForm.value;
        await this.subscribeToNewsletter(formData.email);

        // Show success message
        alert('Te-ai abonat cu succes la newsletter! Vei primi confirmarea pe email.');
        this.newsletterForm.reset();

      } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('A apărut o eroare la abonare. Te rugăm să încercați din nou.');
      } finally {
        this.isSubscribing = false;
      }
    } else {
      this.markNewsletterFormAsTouched();
    }
  }

  private async subscribeToNewsletter(email: string): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would typically make an HTTP request to your newsletter service
    console.log('Subscribing email to newsletter:', email);

    return Promise.resolve();
  }

  private markNewsletterFormAsTouched(): void {
    Object.keys(this.newsletterForm.controls).forEach(key => {
      this.newsletterForm.get(key)?.markAsTouched();
    });
  }

  isNewsletterFieldInvalid(fieldName: string): boolean {
    const field = this.newsletterForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getNewsletterFieldError(fieldName: string): string {
    const field = this.newsletterForm.get(fieldName);

    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return fieldName === 'email' ? 'Adresa de email este obligatorie' : 'Acest câmp este obligatoriu';
      }
      if (field.errors['email']) {
        return 'Adresa de email nu este validă';
      }
    }
    return '';
  }

  trackByPostId(index: number, post: BlogPost): string {
    return post.id;
  }

  trackByCategoryId(index: number, category: BlogCategory): string {
    return category.id;
  }
}
