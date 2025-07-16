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
    // Only navigate to existing routes
    if (route === '/aplicari') {
      this.router.navigate([route]);
    } else {
      // Temporarily show alert for non-implemented routes
      alert(`Secțiunea "${route}" va fi implementată în curând!`);
    }
  }

  onLogin(): void {
    // Temporarily show alert for login
    alert('Funcționalitatea de login va fi implementată în curând!');
  }
}
