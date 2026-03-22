// src/app/features/notifications/notification.routes.ts
import { Routes } from '@angular/router';

export const notificationRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./notification/notification.component')
        .then(m => m.NotificationComponent)
  }
];