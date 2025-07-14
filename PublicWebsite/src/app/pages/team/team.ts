import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  linkedinUrl?: string;
  imageUrl: string;
  isCoordinator?: boolean;
  isFounder?: boolean;
  department?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team.html',
  styleUrls: ['./team.scss'],
  animations: [
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease-out')
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
export class TeamComponent implements OnInit {

  activeMembers: TeamMember[] = [
    {
      id: 'rares-smeu',
      name: 'Rareș Smeu',
      role: 'Coordonator TSG',
      linkedinUrl: 'https://www.linkedin.com/in/rares-smeu-21683216b/',
      imageUrl: 'PublicWebsite/src/assets/images/team/rares.jpg',
      isCoordinator: true,
      department: 'management'
    },
    {
      id: 'mihnea-hututui',
      name: 'Mihnea Huțuțui',
      role: 'Design Lead',
      linkedinUrl: 'https://www.linkedin.com/in/mihneahututui/',
      imageUrl: '../../../assets/images/team/mihnea.jpg',
      department: 'design'
    },
    {
      id: 'sebastian-soimaru',
      name: 'Sebastian Soimaru',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/soimaru-sebastian-4979b9225/',
      imageUrl: 'assets/images/team/sebastian.jpg',
      department: 'mobile'
    },
    {
      id: 'antonio-gherman',
      name: 'Antonio Gherman',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/gherman-antonio-a849a7252/',
      imageUrl: 'assets/images/team/antonio.jpg',
      department: 'mobile'
    },
    {
      id: 'vlad-dinu',
      name: 'Vlad Dinu',
      role: 'Backend Lead',
      linkedinUrl: 'https://www.linkedin.com/in/vladut-dinu-a32742214/',
      imageUrl: 'assets/images/team/vlad.jpg',
      department: 'backend'
    },
    {
      id: 'victor-aldica',
      name: 'Victor Aldica',
      role: 'Backend Developer',
      linkedinUrl: '#',
      imageUrl: 'assets/images/team/victor.jpg',
      department: 'backend'
    },
    {
      id: 'maria-terecoasa',
      name: 'Maria Terecoasa',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/alexandra-terecoasa-395445271/',
      imageUrl: 'assets/images/team/terechoasa-alexandra.png',
      department: 'fullstack'
    },
    {
      id: 'augustin-matea',
      name: 'Augustin Mătea',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/augustin-ioan-m%C4%83tea-887bb612b/',
      imageUrl: 'assets/images/team/augustin-matea.png',
      department: 'frontend'
    },
    {
      id: 'daniela-cozulea',
      name: 'Daniela Cozulea',
      role: 'Web Designer',
      linkedinUrl: 'https://www.linkedin.com/in/daniela-cozulbeginner-in-web-design/',
      imageUrl: 'assets/images/team/daniela.png',
      department: 'design'
    },
    {
      id: 'eduard-petho',
      name: 'Eduard Petho',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/eduh/',
      imageUrl: 'assets/images/team/eduard.png',
      department: 'fullstack'
    },
    {
      id: 'norbert-szasznika',
      name: 'Norbert Szasznika',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/norbert-szasznika-526137257/',
      imageUrl: 'assets/images/team/norbert.png',
      department: 'mobile'
    },
    {
      id: 'iulia-rosca',
      name: 'Iulia Roșca',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/iulia-ro%C8%99ca-687628297/',
      imageUrl: 'assets/images/team/iulia.png',
      department: 'fullstack'
    },
    {
      id: 'bianca-streuneanu',
      name: 'Bianca Streuneanu',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/bianca-streuneanu-379442271/',
      imageUrl: 'assets/images/team/bianca.png',
      department: 'fullstack'
    },
    {
      id: 'cosmin-daia',
      name: 'Cosmin Daia',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/cosmin-mihai-daia-421630278/',
      imageUrl: 'assets/images/team/daia-2.png',
      department: 'fullstack'
    },
    {
      id: 'ana-voineag',
      name: 'Ana Voineag',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/ana-maria-voineag/',
      imageUrl: 'assets/images/team/team-photos-aff.png',
      department: 'fullstack'
    }
  ];

  alumniMembers: TeamMember[] = [
    {
      id: 'andrei-benea',
      name: 'Andrei Benea',
      role: 'Fondator TSG',
      linkedinUrl: 'https://www.linkedin.com/in/andrei-benea/',
      imageUrl: 'assets/images/team/default-avatar.png',
      isFounder: true,
      department: 'management'
    },
    {
      id: 'sergiu-gavril',
      name: 'Sergiu Gavril',
      role: 'DevOps/Automation',
      linkedinUrl: 'https://www.linkedin.com/in/gavrilsergiu/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'devops'
    },
    {
      id: 'georgiana-timo',
      name: 'Georgiana Timo',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/valeria-georgiana-timo-36576a139/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'daniela-dumitrascu',
      name: 'Daniela Dumitrașcu',
      role: 'Frontend Developer',
      linkedinUrl: '#',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'beatrice-balan',
      name: 'Beatrice Balan',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/beatrice-balan-0817b6217/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'daniel-podaru',
      name: 'Daniel Podaru',
      role: 'Frontend Developer',
      linkedinUrl: '#',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'bogdan-musat',
      name: 'Bogdan Mușat',
      role: 'Backend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/eduard-bogdan-mu%C8%99at-286916234/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'backend'
    },
    {
      id: 'ana-roman',
      name: 'Ana Roman',
      role: 'Coordonator/Comunicare & Firme',
      linkedinUrl: 'https://www.linkedin.com/in/ana-roman-b3a4601b4/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'communication'
    },
    {
      id: 'leon-hagiu',
      name: 'Leon Hagiu',
      role: 'Tutoriale',
      linkedinUrl: 'https://www.linkedin.com/in/leon-hagiu-087353245/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'education'
    },
    {
      id: 'ruxandra-dumitru',
      name: 'Ruxandra Dumitru',
      role: 'Graphic Designer',
      linkedinUrl: 'https://www.linkedin.com/in/ruxandra-dumitru-5780b11b3/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'design'
    },
    {
      id: 'marco-statescu',
      name: 'Marco Stătescu',
      role: 'Graphic Designer',
      linkedinUrl: 'https://www.linkedin.com/in/marco-statescu-516967219/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'design'
    },
    {
      id: 'robert-hadadea',
      name: 'Robert Hădadea',
      role: 'Coordonator TSG/Backend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/silviu-robert-h%C4%83dadea-8400ba196/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'management'
    },
    {
      id: 'andrei-pascale',
      name: 'Andrei Pascale',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/george-andrei-pascale-81a261211/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'mobile'
    },
    {
      id: 'ciprian-goia',
      name: 'Ciprian Goia',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/ciprian-goia-951537197/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'bogdan-balan',
      name: 'Bogdan Balan',
      role: 'Mobile Developer',
      linkedinUrl: 'https://www.linkedin.com/in/bogdan-balan11/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'mobile'
    },
    {
      id: 'andreea-staticher',
      name: 'Andreea Staticher',
      role: 'Comunicare & Firme',
      linkedinUrl: 'https://www.linkedin.com/in/andreea-staticher-7a4894225/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'communication'
    },
    {
      id: 'andrei-vlasa',
      name: 'Andrei Vlasa',
      role: 'Frontend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/andrei-vlasa-2219161b2/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'cosmin-badea',
      name: 'Cosmin Badea',
      role: 'Backend Developer',
      linkedinUrl: 'https://www.linkedin.com/in/cosmin-sebastian-badea-664222253/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'backend'
    },
    {
      id: 'darius-muscalu',
      name: 'Darius Muscalu',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/dariusmuscalu/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'mobile'
    },
    {
      id: 'andreea-gobej',
      name: 'Andreea Gobej',
      role: 'Comunicare & Firme',
      linkedinUrl: 'https://www.linkedin.com/in/andreea-gobej-4b695a208/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'communication'
    },
    {
      id: 'cristina-gavrila',
      name: 'Cristina Gavrilă',
      role: 'Lead Mobile App',
      linkedinUrl: 'https://www.linkedin.com/in/cristina-gabriela-gavril%C4%83-3490ba18a/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'mobile'
    },
    {
      id: 'andrei-constantin',
      name: 'Andrei Constantin',
      role: 'Frontend Lead',
      linkedinUrl: 'https://www.linkedin.com/in/andrei-a-constantin/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'frontend'
    },
    {
      id: 'daniel-nwaeke',
      name: 'Daniel Nwaeke',
      role: 'Full Stack Developer',
      linkedinUrl: 'https://www.linkedin.com/in/daniel-nwaeke-4807a61b0/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'fullstack'
    },
    {
      id: 'alexia-avramescu',
      name: 'Alexia Avramescu',
      role: 'Mobile App Developer',
      linkedinUrl: 'https://www.linkedin.com/in/alexia-avramescu-4542a52a2/',
      imageUrl: 'assets/images/team/default-avatar.png',
      department: 'mobile'
    }
  ];

  showAlumni: boolean = false;

  ngOnInit(): void {
    // Component initialization
  }

  onMemberImageError(event: any): void {
    // Fallback to default avatar if image fails to load
    event.target.src = 'assets/images/team/default-avatar.png';
  }

  openLinkedInProfile(url: string): void {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  getMemberCardClass(member: TeamMember): string {
    let classes = 'member-card';

    if (member.isFounder) {
      classes += ' founder';
    } else if (member.isCoordinator) {
      classes += ' coordinator';
    }

    if (member.department) {
      classes += ` ${member.department}`;
    }

    return classes;
  }

  getMemberDataRole(member: TeamMember): string {
    return member.department || 'general';
  }

  toggleAlumniVisibility(): void {
    this.showAlumni = !this.showAlumni;
  }

  trackByMemberId(index: number, member: TeamMember): string {
    return member.id;
  }
}
