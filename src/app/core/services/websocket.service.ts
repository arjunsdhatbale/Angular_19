import { Injectable } from '@angular/core';

import {   OnDestroy } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {

 private client!: Client;
  private connected$ = new BehaviorSubject<boolean>(false);


  constructor() { }
  
  connect(): void {
    this.client = new Client({

      // ✅ Use imported SockJS for browser compatibility
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws');
      },

      onConnect: () => {
        console.log('✅ WebSocket connected');
        this.connected$.next(true);
      },

      onDisconnect: () => {
        console.log('❌ WebSocket disconnected');
        this.connected$.next(false);
      },

      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },

      reconnectDelay: 5000
    });

    this.client.activate();
  }
  disconnect(): void {
    if (this.client?.active) {
      this.client.deactivate();
    }
  }

  subscribe(topic: string, callback: (message: IMessage) => void): StompSubscription | null {
    if (this.client?.connected) {
      return this.client.subscribe(topic, callback);
    }

    // wait for connection then subscribe
    const sub = this.connected$.subscribe(isConnected => {
      if (isConnected) {
        this.client.subscribe(topic, callback);
        sub.unsubscribe();
      }
    });

    return null;
  }

  sendMessage(destination: string, body: string): void {
    if (this.client?.connected) {
      this.client.publish({
        destination,
        body
      });
    } else {
      console.warn('WebSocket not connected yet');
    }
  }

  // ── Is connected? ────────────────────────────
  isConnected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
} 
