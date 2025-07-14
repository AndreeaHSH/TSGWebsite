import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
      technologies: [],
      requirements: [
        'Cunoștințe în testare manuală și/sau automatizată',
        'Experiență cu instrumente de testare (Selenium, JUnit, TestNG)',
        'Cunoștințe de baze de date și SQL pentru verificarea integrității datelor'
      ],
      category: 'testing'
    },
    {
      id: 'backend',
      title: 'Back End Developer – Construiește Viitorul Digital!',
      technologies: ['.NET', 'SQL Server'],
      requirements: [
        'Cunoștințe de bază în dezvoltarea de aplicații .NET (C#, ASP.NET)',
        'Experiență cu SQL Server și scrierea de proceduri stocate',
        'Cunoștințe fundamentale de Front End (HTML, CSS, JavaScript)',
        'Cunoștințe de API-uri RESTful și integrări externe'
      ],
      category: 'development'
    },
    {
      id: 'network',
      title: 'Network Engineer – Conectează Lumea Digitală!',
      technologies: ['Networking'],
      requirements: [
        'Configurarea și întreținerea rețelelor locale (LAN), VPN-uri și echipamente de rețea',
        'Cunoștințe de bază în administrarea serverelor și bazelor de date',
        'Înțelegerea protocoalelor de rețea (TCP/IP, HTTP, DNS, DHCP)',
        'Abilitatea de a rezolva probleme legate de conectivitate și performanță a rețelei',
        'Cunoștințe fundamentale de administrare a infrastructurii IT'
      ],
      category: 'network'
    },
    {
      id: 'hr',
      title: 'HR Specialist – Explorează Lumea Resurselor Umane!',
      technologies: [],
      requirements: [
        'Experiență în recrutare și selecție',
        'Abilități excelente de comunicare și organizare'
      ],
      category: 'hr'
    }
  ];

  projects: Project[] = [
    {
      id: 'student-app',
      title: 'Aplicația de mobil Student@UNITBV',
      description: 'Aplicația Student@UNITBV ajută studenții să își organizeze mai bine prioritățile de la facultate, aplicația dispunând de diferite feature-uri foarte utile. În cadrul acesteia, studenții își pot verifica orarul într-un format accesibil, notele, harta corpurilor de clădire, regulamentele, meniul zilnic de la cantină, știrile și evenimentele importante.',
      type: 'project'
    },
    {
      id: 'agsis',
      title: 'Aplicația de cazare AGSIS',
      description: 'Reprezintă proiectul de debut al echipei, proiect propus în cadrul programului „Noi dezvoltăm Universitatea". Aplicația a avut ca scop digitalizarea procesului de cazare în căminele studențești, prin realizarea unei fluidități mai bune a procesului.',
      type: 'project'
    },
    {
      id: 'cantina',
      title: 'Aplicația de CANTINĂ',
      description: 'Aplicația de cantină a fost creată cu scopul îmbunătățirii procesului de actualizare a meniului zilnic. Aceasta poate fi accesată atât din platforma Intranet a universității, unde studenții pot verifica meniul din ziua curentă, cât și din aplicația de mobil Student@UNITBV.',
      type: 'project'
    },
    {
      id: 'lichidare',
      title: 'Lichidare',
      description: 'Dacă nu știi la ce se referă acest proiect sau cum e sa trebuiască sa mergi fizic cu o hartie de lichidare pentru a fi semnată de către secretariatul facultății, secretariatul de departament, serviciul cămine, biroul Erasmus și bibliotecă, asta este datorită faptului ca am digitalizat și automatizat acest proces.',
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
    // Navigate to application form or handle application logic
    console.log('Navigating to application form...');
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
