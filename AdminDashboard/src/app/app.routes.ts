// AdminDashboard/src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Default route - redirect to applications
  {
    path: '',
    redirectTo: '/aplicari',
    pathMatch: 'full'
  },

  // Volunteer Applications Routes
  {
    path: 'aplicari',
    loadComponent: () => import('./components/volunteers/volunteer-list/volunteer-list.component').then(m => m.VolunteerListComponent),
    title: 'Aplicări - TSG Admin'
  },
  {
    path: 'aplicari/:id',
    loadComponent: () => import('./components/volunteers/volunteer-detail/volunteer-detail.component').then(m => m.VolunteerDetailComponent),
    title: 'Detalii Aplicant - TSG Admin'
  },

  // Blog Management Routes
  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog-management/blog-management.component').then(m => m.BlogManagementComponent),
    title: 'Management Blog - TSG Admin'
  },
  {
    path: 'blog/create',
    loadComponent: () => import('./components/blog/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent),
    title: 'Postare Nouă - TSG Admin'
  },
  {
    path: 'blog/edit/:id',
    loadComponent: () => import('./components/blog/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent),
    title: 'Editează Postarea - TSG Admin'
  },

  // Reports Route (commented out until implemented)
  // {
  //   path: 'raport',
  //   loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
  //   title: 'Rapoarte - TSG Admin'
  // },

  // Authentication Route (commented out until implemented)
  // {
  //   path: 'login',
  //   loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
  //   title: 'Login - TSG Admin'
  // },

  // Catch-all route - redirect to applications
  {
    path: '**',
    redirectTo: '/aplicari'
  }
];
