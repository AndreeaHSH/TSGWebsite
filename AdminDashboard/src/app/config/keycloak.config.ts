import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment';

export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloakUrl,
        realm: environment.keycloakRealm,
        clientId: environment.keycloakClientId,
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256'
      },
      enableBearerInterceptor: true,
      bearerExcludedUrls: ['/assets'],
      bearerPrefix: 'Bearer',
      loadUserProfileAtStartUp: true
    });
}
