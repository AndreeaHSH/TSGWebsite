// PublicWebsite/src/app/pages/home/home.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface VolunteerPosition {
  id: string;
  title: string;
  technologies?: string[];
  requirements: string[];
  category: 'development' | 'design' | 'testing' | 'network' | 'hr';
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
        animate('0.8s ease-out')
      ])
    ]),
    trigger('fadeInRight', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('0.8s ease-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  // Add Router to constructor
  constructor(private router: Router) {}

  volunteerPositions: VolunteerPosition[] = [
    {
      id: 'frontend',
      title: 'Front End Developer – Explorează Creativitatea Digitală!',
      technologies: ['React', 'Vue', 'Angular'],
      requirements: [
        'HTML, CSS și JavaScript (ES6+)',
        'Preprocesatoare CSS (SASS, LESS)',
        'Cunoștințe de bază Back End (.NET, SQL Server)'
      ],
      category: 'development'
    },
    {
      id: 'mobile',
      title: 'Mobile Developer (Flutter) – Dă Viață Aplicațiilor Mobile!',
      technologies: ['Flutter'],
      requirements: [
        'Cunoștințe solide în dezvoltarea de aplicații mobile cu Flutter',
        'Experiență cu integrarea API-urilor și baze de date locale'
      ],
      category: 'development'
    },
    {
      id: 'uiux',
      title: 'Ui/Ux & Web Designer – Modelează Experiența Vizuală!',
      technologies: ['Figma', 'WordPress'],
      requirements: [
        'Experiență cu WordPress & Elementor (teme, plugins)',
        'Design Ui/Ux folosind Figma/Adobe XD',
        'Abilitatea de a crea prototip-uri și mockup-uri',
        'Înțelegerea principiilor de responsive design'
      ],
      category: 'design'
    },
    {
      id: 'tester',
      title: 'Tester Automat/Manual – Asigură Calitatea Software-ului!',
      technologies: ['Selenium', 'Postman'],
      requirements: [
        'Cunoștințe în testarea manuală și automatizată',
        'Experiență cu Selenium și Postman',
        'Abilitatea de a identifica și raporta bug-uri'
      ],
      category: 'testing'
    },
    {
      id: 'network',
      title: 'Network & Infrastructure Specialist – Construiește Fundația Digitală!',
      technologies: ['Cisco', 'Windows Server'],
      requirements: [
        'Cunoștințe în administrarea rețelelor și infrastructurii IT',
        'Experiență cu echipamentele Cisco și Windows Server'
      ],
      category: 'network'
    },
    {
      id: 'hr',
      title: 'HR Specialist – Conectează Talentele cu Oportunitățile!',
      requirements: [
        'Abilități excelente de comunicare și interpersonale',
        'Experiență în recrutare și selecție de personal',
        'Cunoștințe în dezvoltarea resursei umane'
      ],
      category: 'hr'
    }
  ];

  projects: Project[] = [
    {
      id: 'e-scoala',
      title: 'E-Școala',
      description: 'E-Școala este o platformă revoluționară destinată transformării digitale a educației, conectând studenții, profesorii și părinții într-un ecosistem educațional integrat.',
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
    // Use programmatic navigation as backup
    console.log('Navigating to application form...');

    // Try to navigate programmatically
    this.router.navigate(['/tsg-application']).catch(error => {
      console.error('Navigation failed:', error);
      // Fallback to the correct route if the primary one fails
      this.router.navigate(['/aplica']).catch(fallbackError => {
        console.error('Fallback navigation also failed:', fallbackError);
      });
    });
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
