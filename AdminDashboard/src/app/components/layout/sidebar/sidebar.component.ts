// AdminDashboard/src/app/components/layout/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  isActive?: boolean;
  isEnabled: boolean;
  description?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  navigationItems: NavigationItem[] = [
    {
      label: 'Aplicări',
      route: '/aplicari',
      icon: '📋',
      isEnabled: true,
      description: 'Gestionează aplicările de voluntariat'
    },
    {
      label: 'Blog',
      route: '/blog',
      icon: '📝',
      isEnabled: true,
      description: 'Creează și gestionează postările de blog'
    },
    {
      label: 'Raport',
      route: '/raport',
      icon: '📊',
      isEnabled: false,
      description: 'Statistici și rapoarte (în curând)'
    }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string, isEnabled: boolean): void {
    if (isEnabled) {
      this.router.navigate([route]);
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  // Handle logout (placeholder for future implementation)
  logout(): void {
    // TODO: Implement logout functionality
    console.log('Logout functionality will be implemented here');
    // For now, just show an alert
    alert('Funcționalitatea de logout va fi implementată în curând');
  }
}
