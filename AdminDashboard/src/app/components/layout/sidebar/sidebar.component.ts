import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

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
      isEnabled: true,
      description: 'Statistici și rapoarte'
    }
  ];

    constructor(private router: Router, private authService: AuthService) {}

  navigateTo(route: string, isEnabled: boolean): void {
    if (isEnabled) {
      this.router.navigate([route]);
    }
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  logout(): void {
  this.authService.logout();
  }
}
