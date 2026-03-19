import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { UserStore } from '../../../../store/user.store';
 

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  

  userForm!: FormGroup;
  isEditMode = false;
  userId!: number;
  loading = false;

  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
    { label: 'Manager', value: 'MANAGER' }
  ];


  ngOnInit(): void {
    this.userId    = this.route.snapshot.params['id'];
    this.isEditMode = !!this.userId;
    this.initForm();
    if (this.isEditMode) {
      this.loadUserData();
    }
  }


  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName:  ['', [Validators.required, Validators.minLength(2)]],
      email:     ['', [Validators.required, Validators.email]],
      password:  ['', this.isEditMode
                        ? []
                        : [Validators.required, Validators.minLength(8)]],
      phone:     ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      role:      ['USER', Validators.required]
    });
  }

  loadUserData(): void {
    const selected = this.userStore.selectedUser();
    if (selected) {
      this.userForm.patchValue(selected);
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();  
    return;
  }
    this.loading = true;

    const request$ = this.isEditMode
      ? this.userService.updateUser(this.userId, this.userForm.value)
      : this.userService.createUser(this.userForm.value);

    request$.subscribe({
      next: (res) => {
        this.isEditMode
          ? this.userStore.updateUser(res.data)
          : this.userStore.addUser(res.data);

        this.messageService.add({
          severity: 'success',
          summary:  'Success',
          detail:   `User ${this.isEditMode ? 'updated' : 'created'} successfully`
        });

        setTimeout(() => this.router.navigate(['/users']), 1500);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:  'Error',
          detail:   'Operation failed. Please try again.'
        });
        this.loading = false;
      }
    });
  }


  onCancel(): void {
    this.router.navigate(['/users']);
  }
}
