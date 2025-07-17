// PublicWebsite/src/app/pages/home/home.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface VolunteerPosition {
  id: string;
  title: string;
  technologies?: string[];
  requirements: string[];
  category: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'quote';
  quoteText?: string;
}

interface ContactMethod {
  id: string;
  title: string;
  email: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  animations: [
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('fadeInLeft', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.6s ease-out')
      ])
    ]),
    trigger('fadeInRight', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('0.6s ease-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(private router: Router) {}

  volunteerPositions: VolunteerPosition[] = [
    {
      id: 'frontend-dev',
      title: 'Frontend Developer',
      technologies: ['React', 'Angular', 'Vue.js', 'TypeScript', 'SCSS'],
      requirements: [
        'Cunoștințe de bază HTML, CSS, JavaScript',
        'Experiență cu cel puțin un framework modern',
        'Înțelegerea principiilor UI/UX',
        'Dorința de a învăța tehnologii noi'
      ],
      category: 'development'
    },
    {
      id: 'backend-dev',
      title: 'Backend Developer',
      technologies: ['.NET Core', 'Node.js', 'Python', 'SQL Server', 'MongoDB'],
      requirements: [
        'Cunoștințe de programare în C#, JavaScript sau Python',
        'Înțelegerea bazelor de date',
        'Experiență cu API-uri REST',
        'Cunoștințe de arhitectură software'
      ],
      category: 'development'
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Developer',
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
      requirements: [
        'Experiență în dezvoltare mobile',
        'Cunoștințe de UI/UX pentru mobile',
        'Înțelegerea store-urilor de aplicații',
        'Testare pe dispozitive multiple'
      ],
      category: 'development'
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      requirements: [
        'Portfoliu de design UI/UX',
        'Cunoștințe de design thinking',
        'Experiență cu tools de design',
        'Înțelegerea user experience'
      ],
      category: 'design'
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      technologies: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud'],
      requirements: [
        'Cunoștințe de infrastructură cloud',
        'Experiență cu automatizarea deployment-ului',
        'Monitoring și logging',
        'Security best practices'
      ],
      category: 'network'
    },
    {
      id: 'qa-tester',
      title: 'QA Tester',
      requirements: [
        'Atenție la detalii',
        'Metodologii de testare',
        'Documentarea bug-urilor',
        'Testare manuală și automatizată'
      ],
      category: 'testing'
    }
  ];

  projectPreviews: Project[] = [
    {
      id: 'aplicatie-note',
      title: 'Aplicația de Note',
      description: 'Echipa noastră a dezvoltat o aplicație inovatoare pentru organizarea și gestionarea notelor studențești, facilitând procesul de învățare.',
      type: 'project'
    },
    {
      id: 'registratura',
      title: 'Registratură',
      description: 'În încercarea de a continua îmbunătățirea experienței tuturor membrilor Universității, fost creat un sistem hibrid al fluxurilor de documente din cadrul Rectoratului Universității. Aplicația prezintă funcțiile unui sistem de management al documentelor.',
      type: 'project'
    },
    {
      id: 'quote',
      title: 'Code Quote',
      description: '',
      type: 'quote',
      quoteText: 'EAT. SLEEP. CODE. REPEAT.'
    }
  ];

  contactMethods: ContactMethod[] = [
    {
      id: 'technical',
      title: 'Probleme tehnice:',
      email: 'tsg.unitbv@gmail.com'
    },
    {
      id: 'hr',
      title: 'Resurse umane:',
      email: 'hr.tsg.unitbv@gmail.com'
    }
  ];

  benefits: string[] = [
    'Experiență profesională din timpul studenției',
    'Posibilitatea de a învăța și de a te dezvolta continuu',
    'Distracție și oportunități de a îmbunătăți viața studenților'
  ];

  ngOnInit(): void {
    // Component initialization logic
  }

  ngOnDestroy(): void {
    // Cleanup logic
  }

  onApplyClick(): void {
    // Navigate to application form - this will be called by the routerLink
    // The navigation is already handled by routerLink="/aplica"
    // This method can be used for analytics or other side effects
    console.log('User clicked Apply button - navigating to application form');
  }

  onLearnMoreClick(): void {
    // Scroll to about section
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  onContactEmailClick(email: string): void {
    window.location.href = `mailto:${email}`;
  }

  trackByVolunteerId(index: number, item: VolunteerPosition): string {
    return item.id;
  }

  trackByProjectId(index: number, item: Project): string {
    return item.id;
  }

  trackByContactId(index: number, item: ContactMethod): string {
    return item.id;
  }
}
