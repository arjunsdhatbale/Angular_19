import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { UserStore } from '../../../../store/user.store';
import { User } from '../../models/user.model';
 

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

   private userService = inject(UserService);
  private userStore = inject(UserStore);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  users = this.userStore.users;
  loading = this.userStore.loading;

  ngOnInit(): void {
     this.loadUsers();
    
  }
  
  loadUsers(): void {
    this.userStore.setLoading(true);
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userStore.setUsers(res.data);
        this.userStore.setLoading(false);
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
        this.userStore.setLoading(false);
      }
    });
  }


  navigateToCreate(): void {
    this.router.navigate(['/users/create']);
  }

  navigateToEdit(user: User): void {
    this.userStore.setSelectedUser(user);
    this.router.navigate(['/users/edit', user.id]);
  }

confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteUser(user.id)
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.userStore.removeUser(id);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
      }
    });
  }

  getStatusSeverity(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'success',
      INACTIVE: 'warn',
      BLOCKED: 'danger'
    };
    return map[status] || 'info';
  }
}
