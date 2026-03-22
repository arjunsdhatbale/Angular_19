import { inject, Injectable, signal } from '@angular/core';

import { IMessage } from '@stomp/stompjs';
import { NotificationMessage } from '../models/notification.model';
import { WebsocketService } from '../../../core/services/websocket.service';
 
 
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
private wsService = inject(WebsocketService);

  // Signal to hold all notifications
  notifications = signal<NotificationMessage[]>([]);  
  unreadCount   = signal<number>(0);
  constructor() { }

  init(): void {
    this.wsService.connect();

    // Subscribe to /topic/notification
    this.wsService.subscribe('/topic/notification', (message: IMessage) => {
      const notification: NotificationMessage = {
        message:   message.body,
        timestamp: new Date().toLocaleTimeString()
      };

      // Add to notifications list
      this.notifications.update((list: any) => [notification, ...list]);

      // Increment unread count
      this.unreadCount.update((count: number) => count + 1);

      console.log('📩 Notification received:', notification);
    });
  }
  subscribe(arg0: string, arg1: (message: IMessage) => void) {
    throw new Error('Method not implemented.');
  }
  connect() {
    throw new Error('Method not implemented.');
  }

  // ── Send notification to backend ─────────────
  // POST to /app/send-message
  sendNotification(message: string): void {
    this.wsService.sendMessage('/app/send-message', message);
  }
  sendMessage(arg0: string, message: string) {
    throw new Error('Method not implemented.');
  }

  markAllRead(): void {
    this.unreadCount.set(0);
  }

  // ── Clear all notifications ───────────────────
  clearAll(): void {
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
}
