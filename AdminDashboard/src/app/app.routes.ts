import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/aplicari',
    pathMatch: 'full'
  },
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
  // {
  //   path: 'blog',
  //   loadComponent: () => import('./components/blog/blog-management/blog-management.component').then(m => m.BlogManagementComponent),
  //   title: 'Blog Management - TSG Admin'
  // },
  // {
  //   path: 'raport',
  //   loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
  //   title: 'Rapoarte - TSG Admin'
  // },
  // {
  //   path: 'login',
  //   loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
  //   title: 'Login - TSG Admin'
  // },
  {
    path: '**',
    redirectTo: '/aplicari'
  }
];
