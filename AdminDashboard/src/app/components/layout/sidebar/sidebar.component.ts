import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private router: Router) {}

  navigationItems = [
    {
      id: 'aplicari',
      label: 'Aplicări',
      route: '/aplicari',
      icon: '👥'
    },
    {
      id: 'blog',
      label: 'Blog',
      route: '/blog',
      icon: '📝'
    },
    {
      id: 'raport',
      label: 'Raport',
      route: '/raport',
      icon: '📊'
    }
  ];

  isActiveRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  onNavigate(route: string): void {
    this.router.navigate([route]);
  }

  onLogin(): void {
    this.router.navigate(['/login']);
  }
}
