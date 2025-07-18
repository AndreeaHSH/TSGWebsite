import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: Date;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresAt: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  /**
   * Load user data from localStorage on service initialization
   */
  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (token && userStr && expiresAt) {
      try {
        const user = JSON.parse(userStr);
        const expiration = new Date(expiresAt);

        if (expiration > new Date()) {
          this.currentUserSubject.next(user);
          this.setTokenExpirationTimer(expiration);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.logout();
      }
    }
  }

  /**
   * Set timer for automatic logout when token expires
   */
  private setTokenExpirationTimer(expirationDate: Date): void {
    const timeout = expirationDate.getTime() - Date.now();

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, timeout);
  }

  /**
   * Clear token expiration timer
   */
  private clearTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  /**
   * User login
   */
  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
          catchError(this.handleError)
        )
      );

      // Store authentication data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('tokenExpiresAt', response.expiresAt);

      // Update current user
      this.currentUserSubject.next(response.user);

      // Set expiration timer
      this.setTokenExpirationTimer(new Date(response.expiresAt));

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * User registration
   */
  async register(userData: RegisterDto): Promise<User> {
    try {
      return await firstValueFrom(
        this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * User logout
   */
  logout(): void {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiresAt');

    // Clear timer
    this.clearTokenExpirationTimer();

    // Update current user
    this.currentUserSubject.next(null);

    // Redirect to login
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('tokenExpiresAt');

    if (!token || !expiresAt) {
      return false;
    }

    return new Date(expiresAt) > new Date();
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Refresh user data from server
   */
  async refreshUser(): Promise<User> {
    try {
      const user = await firstValueFrom(
        this.http.get<User>(`${this.apiUrl}/me`).pipe(
          catchError(this.handleError)
        )
      );

      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);

      return user;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/change-password`, {
          currentPassword,
          newPassword
        }).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/forgot-password`, { email }).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error requesting password reset:', error);
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${this.apiUrl}/reset-password`, {
          token,
          newPassword
        }).pipe(
          catchError(this.handleError)
        )
      );
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  /**
   * Get token expiration time
   */
  getTokenExpiration(): Date | null {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    return expiresAt ? new Date(expiresAt) : null;
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expiration = this.getTokenExpiration();
    if (!expiration) return false;

    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiration <= fiveMinutesFromNow;
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Invalid credentials. Please check your username and password.';
          this.logout();
          break;
        case 403:
          errorMessage = 'Access forbidden. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Service not found. Please try again later.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict. User already exists.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation failed. Please check your input.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Unexpected error: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  };
}
