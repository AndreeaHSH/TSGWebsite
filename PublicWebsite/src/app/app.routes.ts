// PublicWebsite/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home route
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'TSG - Transilvania Star Group'
  },

  // Blog routes
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent),
    title: 'Blog - TSG'
  },
  // Future blog detail route
  // {
  //   path: 'blog/:slug',
  //   loadComponent: () => import('./pages/blog/blog-detail/blog-detail').then(m => m.BlogDetailComponent),
  //   title: 'Blog Post - TSG'
  // },
  // {
  //   path: 'blog/tag/:tag',
  //   loadComponent: () => import('./pages/blog/blog-tag/blog-tag').then(m => m.BlogTagComponent),
  //   title: 'Blog Tag - TSG'
  // },

  // Other existing routes
  {
    path: 'echipa',
    loadComponent: () => import('./pages/team/team').then(m => m.TeamComponent),
    title: 'Echipa - TSG'
  },
  {
    path: 'proiecte',
    loadComponent: () => import('./pages/projects/projects').then(m => m.ProjectsComponent),
    title: 'Proiecte - TSG'
  },
  {
    path: 'aplica',
    loadComponent: () => import('./forms/tsg-application/tsg-application').then(m => m.TsgApplicationComponent),
    title: 'Aplică - TSG'
  },

  // Redirect any unknown routes to home
  {
    path: '**',
    redirectTo: ''
  }
];
