// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'Acasă - Transilvania Star Group'
  },
  {
    path: 'team',
    loadComponent: () => import('./pages/team/team').then(m => m.TeamComponent),
    title: 'Echipa TSG - Transilvania Star Group'
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsComponent),
    title: 'Proiecte - Transilvania Star Group'
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent),
    title: 'Blog - Transilvania Star Group'
  },
  {
    path: 'tsg-application',
    loadComponent: () => import('./forms/tsg-application/tsg-application').then(m => m.TsgApplicationComponent),
    title: 'Aplicare Voluntariat - Transilvania Star Group'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
