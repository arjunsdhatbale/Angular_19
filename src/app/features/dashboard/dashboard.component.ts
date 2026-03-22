// src/app/features/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:2rem;">
      <h2>🏠 Dashboard</h2>
      <p>Dashboard coming soon...</p>
    </div>
  `
})
export class DashboardComponent {}