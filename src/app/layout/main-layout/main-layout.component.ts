import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { Divider } from "primeng/divider";
import { Button } from "primeng/button";
import { Avatar } from "primeng/avatar";

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, Divider, Button, Avatar],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private router = inject(Router);

  sidebarVisible = true;

  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Products', route: '/products', icon: 'pi pi-box' },
    { label: 'Users', route: '/users', icon: 'pi pi-users' },
    { label: 'Notifications', route: '/notifications', icon: 'pi pi-bell', badge: true }
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  unreadCount(): number {
    // TODO: Implement with notification service
    return 5; // Placeholder
  }

  logout() {
    // TODO: Implement logout logic
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }
}
