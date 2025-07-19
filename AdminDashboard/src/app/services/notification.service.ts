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

  /**
   * Show a success notification
   */
  success(message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'success',
      message,
      duration
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, persistent: boolean = false): void {
    this.addNotification({
      type: 'error',
      message,
      persistent,
      duration: persistent ? 0 : 8000
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration: number = 6000): void {
    this.addNotification({
      type: 'warning',
      message,
      duration
    });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'info',
      message,
      duration
    });
  }

  /**
   * Add a notification
   */
  private addNotification(notification: Omit<Notification, 'id'>): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, newNotification]);

    // Auto remove notification after duration
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
    }
  }

  /**
   * Remove a notification
   */
  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(updatedNotifications);
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.next([]);
  }

  /**
   * Generate unique ID for notifications
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
