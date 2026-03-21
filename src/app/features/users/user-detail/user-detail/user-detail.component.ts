import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { UserService } from '../../services/user.service';
import { UserStore } from '../../../../store/user.store';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss'
})
export class UserDetailComponent implements OnInit {

  private route             = inject(ActivatedRoute);
  private router            = inject(Router);
  private userService       = inject(UserService);
  private userStore         = inject(UserStore);
  private messageService    = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  user: User | null = null;
  loading: boolean | undefined;
  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.loadUserDetail(userId);
    }
  }

  loadUserDetail(userId: number): void {
    this.loading = true;
    const selected = this.userStore.selectedUser();
    if (selected && selected.id === userId) {
      this.user = selected;
      this.loading = false;
    } else {
      this.userService.getUserById(userId).subscribe({
        next: (res) => {
          this.user = res.data;
          this.userStore.setSelectedUser(res.data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load user details'
          });
        }
      });
    }
  }

  navigateToEdit(): void {
    if (this.user) {
      this.router.navigate(['/users/edit', this.user.id]);
    }
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser();
      }
    });
  }
  
deleteUser(): void {
    if (!this.user) return;
    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.userStore.removeUser(this.user!.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully'
        });
        setTimeout(() => this.router.navigate(['/users']), 1500);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete user'
        });
      }
    });
  }

  navigateBack(): void {
    this.router.navigate(['/users']);
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      ACTIVE:   'success',
      INACTIVE: 'warn',
      BLOCKED:  'danger'
    };
    return map[status] || 'info';
  }

  getRoleSeverity(role: string): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      ADMIN:   'danger',
      MANAGER: 'warn',
      USER:    'info'
    };
    return map[role] || 'info';
  }

  getFullName(): string {
    return `${this.user?.firstName ?? ''} ${this.user?.lastName ?? ''}`.trim();
  }

   getInitials(): string {
    const f = this.user?.firstName?.charAt(0) ?? '';
    const l = this.user?.lastName?.charAt(0) ?? '';
    return (f + l).toUpperCase();
  }
}
 

