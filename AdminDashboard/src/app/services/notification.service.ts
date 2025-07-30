import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  persistent?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();


  success(message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'success',
      message,
      duration
    });
  }


  error(message: string, persistent: boolean = false): void {
    this.addNotification({
      type: 'error',
      message,
      persistent,
      duration: persistent ? 0 : 8000
    });
  }


  warning(message: string, duration: number = 6000): void {
    this.addNotification({
      type: 'warning',
      message,
      duration
    });
  }


  info(message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'info',
      message,
      duration
    });
  }


  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, newNotification]);

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }


  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(updatedNotifications);
  }


  clearAll(): void {
    this.notifications.next([]);
  }

 
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
