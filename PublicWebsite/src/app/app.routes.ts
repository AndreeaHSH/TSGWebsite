// PublicWebsite/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home route
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
    title: 'TSG - Transilvania Star Group'
  },

  // Blog routes - ORDER IS CRITICAL!
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.BlogComponent),
    title: 'Blog - TSG'
  },

  // Blog tag filter route - MUST come before blog/:slug
  {
    path: 'blog/tag/:tag',
    loadComponent: () => import('./pages/blog/blog-tag/blog-tag').then(m => m.BlogTagComponent),
    title: 'Blog Tag - TSG'
  },

  // Blog detail route - MUST come after specific routes
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/blog-detail/blog-detail').then(m => m.BlogDetailComponent),
    title: 'Blog Post - TSG'
  },

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

  // FIXED: Changed from 'aplica' to 'tsg-application' to match the button's routerLink
  {
    path: 'tsg-application',
    loadComponent: () => import('./forms/tsg-application/tsg-application').then(m => m.TsgApplicationComponent),
    title: 'Aplică - TSG'
  },

  // Optional: Add redirect from old path to new path for backwards compatibility
  {
    path: 'aplica',
    redirectTo: '/tsg-application',
    pathMatch: 'full'
  },

  // Redirect any unknown routes to home
  {
    path: '**',
    redirectTo: ''
  }
];
