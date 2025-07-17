import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

  socialLinks = [
    {
      platform: 'Facebook',
      url: 'https://www.facebook.com/transilvaniastargroup/',
      icon: 'fab fa-facebook-f',
      ariaLabel: 'Facebook'
    },
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/transilvaniastargroup/',
      icon: 'fab fa-instagram',
      ariaLabel: 'Instagram'
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/transilvania-star-group/posts/?feedView=all',
      icon: 'fab fa-linkedin-in',
      ariaLabel: 'LinkedIn'
    },
    {
      platform: 'YouTube',
      url: 'https://www.youtube.com/channel/UC5PbsYmTh2kJuK9G9-GJfZQ',
      icon: 'fab fa-youtube',
      ariaLabel: 'YouTube'
    }
  ];

  // FIXED: Updated navigation links to match app.routes.ts
  navigationLinks = [
    { label: 'Acasă', route: '/' },
    { label: 'Echipa TSG', route: '/echipa' },
    { label: 'Proiecte', route: '/proiecte' },
    { label: 'Blog', route: '/blog' },
    { label: 'Aplică', route: '/aplica' }
  ];

  contactEmails = [
    { label: 'Probleme tehnice', email: 'tsg.unitbv@gmail.com' },
    { label: 'Resurse umane', email: 'hr.tsg.unitbv@gmail.com' }
  ];

  openExternalLink(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
