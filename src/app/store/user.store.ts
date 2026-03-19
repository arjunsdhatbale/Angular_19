// store/user.store.ts
import { Injectable, signal, computed } from '@angular/core';
import { User } from '../features/users/models/user.model';
 
@Injectable({ providedIn: 'root' })
export class UserStore {

  // State
  private _users = signal<User[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);
  private _selectedUser = signal<User | null>(null);

  // Selectors
  users = computed(() => this._users());
  loading = computed(() => this._loading());
  error = computed(() => this._error());
  selectedUser = computed(() => this._selectedUser());
  totalUsers = computed(() => this._users().length);
  activeUsers = computed(() => this._users().filter(u => u.status === 'ACTIVE'));

  // Actions
  setUsers(users: User[]) { this._users.set(users); }
  setLoading(val: boolean) { this._loading.set(val); }
  setError(msg: string | null) { this._error.set(msg); }
  setSelectedUser(user: User | null) { this._selectedUser.set(user); }

  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }

  updateUser(updated: User) {
    this._users.update(users =>
      users.map(u => u.id === updated.id ? updated : u)
    );
  }

  removeUser(id: number) {
    this._users.update(users => users.filter(u => u.id !== id));
  }
}