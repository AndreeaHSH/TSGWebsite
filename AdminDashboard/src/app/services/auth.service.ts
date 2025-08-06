import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userProfileSubject = new BehaviorSubject<KeycloakProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  constructor(private keycloakService: KeycloakService) {
    this.loadUserProfile();
  }

  private async loadUserProfile(): Promise<void> {
    if (this.keycloakService.isLoggedIn()) {
      try {
        const profile = await this.keycloakService.loadUserProfile();
        this.userProfileSubject.next(profile);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    }
  }

  public get isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  public get userRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  public get username(): string {
    return this.keycloakService.getUsername();
  }

  public async getTokenAsync(): Promise<string> {
  try {
    return await this.keycloakService.getToken() || '';
  } catch (error) {
    return '';
    }
  }

  public get token(): string {
    return '';
  }

  public hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  public hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  public async login(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin
    });
  }

  public logout(): void {
    this.keycloakService.logout(window.location.origin);
  }

  public async refreshToken(): Promise<boolean> {
    try {
      return await this.keycloakService.updateToken(30);
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  }

  public getUserInfo(): Observable<KeycloakProfile | null> {
    return this.userProfile$;
  }
}
