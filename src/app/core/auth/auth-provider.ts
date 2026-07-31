import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/auth-user.model';

/**
 * Auth credentials for login — extend as needed.
 */
export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Standardised response from any auth provider.
 */
export interface AuthResult {
  user: User;
  token: string;
}
export abstract class AuthProvider {
  /** Authenticate with credentials and return user + token. */
  abstract login(credentials: AuthCredentials): Observable<AuthResult>;

  /** End the current session. */
  abstract logout(): Observable<void>;

  /**
   * Check whether a session already exists (cookie, token in storage, etc.)
   * and return the user if so.  Return `null` when there is no active session.
   */
  abstract checkSession(): Observable<AuthResult | null>;

  abstract getToken(): string | null;
}


export const AUTH_PROVIDER = new InjectionToken<AuthProvider>('AUTH_PROVIDER');
