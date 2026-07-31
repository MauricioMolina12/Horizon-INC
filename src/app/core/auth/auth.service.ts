import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CookieService } from '../services/cookie.service';

/**
 * Helper to build the state parameter for auth redirects.
 */
function buildStatePayload(): string {
  const statePayload = {
    returnUrl: window.location.href,
    source: 'core',
    nonce: crypto.randomUUID(),
  };
  return btoa(JSON.stringify(statePayload));
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Redirect to the external auth sign-in page.
   */
  redirectToSignIn(): void {
    if (!this.isBrowser) return;
    const state = buildStatePayload();
    window.location.href = `${environment.authDomain}/signin?state=${encodeURIComponent(state)}`;
  }

  /**
   * Redirect to the external auth sign-up page.
   */
  redirectToSignUp(): void {
    if (!this.isBrowser) return;
    const state = buildStatePayload();
    window.location.href = `${environment.authDomain}/signup?state=${encodeURIComponent(state)}`;
  }

  /**
   * POST /session/logout to invalidate the Cognito session.
   * Returns the Observable so the caller (effect) handles navigation on success.
   */
  logout(): Observable<void> {
    const accessToken = this.cookieService.getCookie('holnex_access_token');

    return this.http.post<void>(
      `${environment.BASE_URL}/session/logout`,
      {
        data: {
          access_token: accessToken,
        },
      },
    )
  }
}