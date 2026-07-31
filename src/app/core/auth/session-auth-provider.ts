import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, EMPTY, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthProvider, AuthCredentials, AuthResult } from './auth-provider';
import { CookieService } from '../services/cookie.service';
import { UserService } from '../../store/user/user.service';
import { environment } from '../../../environments/environment';

/**
 * Decode the payload of a JWT without verifying the signature.
 * Used to extract the user id from the `holnex_id_token` cookie.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Concrete implementation of {@link AuthProvider} based on the external auth
 * domain flow:
 *
 * - `login` redirects the browser to the auth domain sign-in page.
 * - `checkSession` reads the `holnex_id_token` cookie set by the auth domain,
 *   decodes the JWT to get the user id and fetches the full user profile.
 * - `logout` is handled by {@link AuthService} (POST /session/logout) in the
 *   effects; this method only satisfies the provider contract.
 */
@Injectable()
export class SessionAuthProvider implements AuthProvider {
  private isBrowser: boolean;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /** Redirect to the external sign-in page. Returns EMPTY (navigation happens). */
  login(_credentials: AuthCredentials): Observable<AuthResult> {
    if (this.isBrowser) {
      const statePayload = {
        returnUrl: window.location.href,
        source: 'core',
        nonce: crypto.randomUUID(),
      };
      const state = btoa(JSON.stringify(statePayload));
      window.location.href = `${environment.authDomain}/signin?state=${encodeURIComponent(state)}`;
    }
    return EMPTY;
  }

  /**
   * Logout is performed by {@link AuthService#logout} in the effects
   * (POST /session/logout). This method is kept for the provider contract.
   */
  logout(): Observable<void> {
    return EMPTY;
  }

  /**
   * Check whether an active session exists by reading `holnex_id_token`.
   * Returns the user + token, or `null` when there is no session.
   */
  checkSession(): Observable<AuthResult | null> {
    const idToken = this.cookieService.getCookie('holnex_id_token');

    if (!idToken) {
      return of(null);
    }

    const payload = decodeJwtPayload(idToken);
    const userId = payload ? (payload['id'] as string) : null;

    if (!userId) {
      return of(null);
    }

    return this.userService.getUserById(userId).pipe(
      map((user) => ({ user, token: idToken })),
      catchError(() => of(null))
    );
  }

  /** Return the raw id token from the cookie, if any. */
  getToken(): string | null {
    return this.cookieService.getCookie('holnex_id_token');
  }
}