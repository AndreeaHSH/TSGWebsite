import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface Project {
  id: string;
  title: string;
  description: string;
  additionalInfo?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  type: 'mobile' | 'web' | 'system' | 'automation';
}

interface ExternalSite {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
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
export class ProjectsComponent implements OnInit {

  featuredProject: Project = {
    id: 'student-unitbv',
    title: 'Aplicația de mobil Student@UNITBV',
    description: 'Aplicația Student@UNITBV ajută studenții să își organizeze mai bine prioritățile de la facultate, aplicația dispunând de diferite feature-uri foarte utile.',
    additionalInfo: 'În cadrul acesteia, studenții își pot verifica orarul într-un format accesibil, notele, harta corpurilor de clădire, regulamentele, meniul zilnic de la cantină, știrile și evenimentele importante.',
    imageUrl: 'https://tsg.unitbv.ro/wp-content/uploads/2022/03/new-APP-MOBILE-MOCK-1024x1024.jpg',
    isFeatured: true,
    type: 'mobile'
  };

  projects: Project[] = [
    {
      id: 'agsis',
      title: 'Aplicația de cazare AGSIS',
      description: 'Reprezintă proiectul de debut al echipei, proiect propus în cadrul programului „Noi dezvoltăm Universitatea". Aplicația a avut ca scop digitalizarea procesului de cazare în căminele studențești, prin realizarea unei fluidități mai bune a procesului.',
      type: 'system'
    },
    {
      id: 'cantina',
      title: 'Aplicația de CANTINĂ',
      description: 'Aplicația de cantină a fost creată cu scopul îmbunătățirii procesului de actualizare a meniului zilnic. Aceasta poate fi accesată atât din platforma Intranet a universității, unde studenții pot verifica meniul din ziua curentă, cât și din aplicația de mobil Student@UNITBV.',
      type: 'web'
    },
    {
      id: 'lichidare',
      title: 'Lichidare',
      description: 'Dacă nu știi la ce se referă acest proiect sau cum e sa trebuiască sa mergi fizic cu o hartie de lichidare pentru a fi semnată de către secretariatul facultății, secretariatul de departament, serviciul cămine, biroul Erasmus și bibliotecă, asta este datorită faptului ca am digitalizat și automatizat acest proces.',
      additionalInfo: 'Astfel, în ultimele zile de facultate te poți concentra mai mult pe ceea ce contează și mai puțin pe birocrație.',
      type: 'automation'
    },
    {
      id: 'registratura',
      title: 'Registratură',
      description: 'În încercarea de a continua îmbunătățirea experienței tuturor membrilor Universității, fost creat un sistem hibrid al fluxurilor de documente din cadrul Rectoratului Universității. Aplicația prezintă funcțiile unui sistem de management al documentelor, în cadrul căruia se pot înregistra documente noi, se pot urmări modificările realizate asupra acestora și este asigurată o stocare centralizată.',
      additionalInfo: 'Astfel, timpul petrecut în cadrul proceselor ce țin de înregistrarea și evidența documentelor este redus, iar trasabilitatea documentelor și transparența sunt semnificativ crescute.',
      type: 'system'
    }
  ];

  externalSites: ExternalSite[] = [
    {
      id: 'practica',
      title: 'Site pentru Platforma de Practică',
      description: 'Platformă destinată promovării oportunităților de practică/intership/job.',
      url: 'https://practica.unitbv.ro',
      category: 'career'
    },
    {
      id: 'consiliere',
      title: 'Site pentru Centrul de consiliere și Orientare în Carieră',
      description: 'Site destinat promovării activităților/evenimentelor organizate de Centru de Consiliere și Orientare în Carieră.',
      url: 'https://consiliere.unitbv.ro',
      category: 'counseling'
    },
    {
      id: 'sas',
      title: 'Site pentru Societatea Antreprenorială Studențească',
      description: 'Site destinat promovării activităților/evenimentelor organizate de Societatea Antreprenorială Studențească.',
      url: 'https://sas.unitbv.ro',
      category: 'entrepreneurship'
    }
  ];

  ngOnInit(): void {
    // Component initialization
  }

  onImageError(event: any): void {
    // Handle image loading errors
    event.target.style.display = 'none';
    console.warn('Failed to load project image:', event.target.src);
  }

  openExternalSite(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  getProjectTypeClass(type: string): string {
    const typeClasses = {
      'mobile': 'project-mobile',
      'web': 'project-web',
      'system': 'project-system',
      'automation': 'project-automation'
    };
    return typeClasses[type as keyof typeof typeClasses] || '';
  }

  trackByProjectId(index: number, project: Project): string {
    return project.id;
  }

  trackBySiteId(index: number, site: ExternalSite): string {
    return site.id;
  }
}
