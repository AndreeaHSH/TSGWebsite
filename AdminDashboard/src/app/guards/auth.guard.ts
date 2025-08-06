import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(): Promise<boolean | UrlTree> {
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin
      });
    }

    const requiredRoles = ['admin', 'member'];

    const hasRequiredRole = requiredRoles.some(role =>
      this.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return this.router.createUrlTree(['/unauthorized']);
    }

    return this.authenticated;
  }
}
