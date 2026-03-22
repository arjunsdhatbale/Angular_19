// features/notifications/notification/notification.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Divider } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../services/notification.service';
import { WebsocketService } from '../../../core/services/websocket.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    Card,
    InputText,
    Divider,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {

  // ✅ Declare without inject at field level
  notificationService!: NotificationService;
  wsService!: WebsocketService;
  messageService!: MessageService;

  messageInput = '';
  isConnected  = false;

  notifications!: any;
  unreadCount!:   any;

  constructor() {
    // ✅ All inject() calls inside constructor
    this.notificationService = inject(NotificationService);
    this.wsService           = inject(WebsocketService);
    this.messageService      = inject(MessageService);

    // ✅ Assign signals after injection
    this.notifications = this.notificationService.notifications;
    this.unreadCount   = this.notificationService.unreadCount;
  }

  ngOnInit(): void {
    this.notificationService.init();

    this.wsService.isConnected().subscribe(status => {
      this.isConnected = status;
    });
  }

  sendMessage(): void {
    if (!this.messageInput.trim()) return;

    this.notificationService.sendNotification(this.messageInput);

    this.messageService.add({
      severity: 'success',
      summary:  'Sent',
      detail:   `Message sent: ${this.messageInput}`
    });

    this.messageInput = '';
  }

  markAllRead(): void {
    this.notificationService.markAllRead();
  }

  clearAll(): void {
    this.notificationService.clearAll();
  }
}