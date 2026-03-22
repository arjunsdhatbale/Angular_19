import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'users',
        loadChildren: () =>
            import('./features/users/users.routes').then(m => m.userRoutes)
    },
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'   
    },
    {
    path: 'products',
    loadChildren: () =>
      import('./features/products/products.routes').then(m => m.productRoutes)
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./features/notifications/notification.routes')
        .then(m => m.notificationRoutes)
  },
  {
    path: '',
    redirectTo: 'notifications',  // ← only ONE empty path redirect
    pathMatch: 'full'
  }
];
