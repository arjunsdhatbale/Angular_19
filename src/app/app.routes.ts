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
  }
];
