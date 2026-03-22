import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
export const routes: Routes = [
  {
     path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
  
    {
        path: 'users',
        loadChildren: () =>
            import('./features/users/users.routes').then(m => m.userRoutes)
    },
    {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(m => m.productRoutes)
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/notification.routes')
        .then(m => m.notificationRoutes)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
]
  }
];
