import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/aplicari',
    pathMatch: 'full'
  },

  {
    path: 'aplicari',
    loadComponent: () => import('./components/volunteers/volunteer-list/volunteer-list.component').then(m => m.VolunteerListComponent),
    title: 'Aplicări - TSG Admin',
    canActivate: [AuthGuard]
  },
  {
    path: 'aplicari/:id',
    loadComponent: () => import('./components/volunteers/volunteer-detail/volunteer-detail.component').then(m => m.VolunteerDetailComponent),
    title: 'Detalii Aplicant - TSG Admin',
    canActivate: [AuthGuard]
  },

  {
    path: 'blog',
    loadComponent: () => import('./components/blog/blog-management/blog-management.component').then(m => m.BlogManagementComponent),
    title: 'Management Blog - TSG Admin',
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/create',
    loadComponent: () => import('./components/blog/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent),
    title: 'Postare Nouă - TSG Admin',
    canActivate: [AuthGuard]
  },
  {
    path: 'blog/edit/:id',
    loadComponent: () => import('./components/blog/blog-editor/blog-editor.component').then(m => m.BlogEditorComponent),
    title: 'Editează Postarea - TSG Admin',
    canActivate: [AuthGuard]
  },

  {
    path: 'raport',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent),
    title: 'Rapoarte - TSG Admin',
    canActivate: [AuthGuard]
  },

  {
    path: 'unauthorized',
    loadComponent: () => Promise.resolve().then(() => ({
    default: class UnauthorizedComponent {
      template = '<div style="text-align: center; margin-top: 50px;"><h2>Unauthorized Access</h2><p>You don\'t have permission to access this resource.</p></div>';
    }
  })),
  title: 'Neautorizat - TSG Admin'
},

  {
    path: '**',
    redirectTo: '/aplicari'
  }
];
