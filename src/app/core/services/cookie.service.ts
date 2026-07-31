import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service for reading cookies from the browser.
 *
 * Only works on the browser side (SSR-safe).
 * Cookies are set by the external auth system (authDomain).
 */
@Injectable({ providedIn: 'root' })
export class CookieService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Get a cookie value by name.
   * Returns `null` if the cookie doesn't exist or not in browser.
   */
  getCookie(name: string): string | null {
    if (!this.isBrowser) return null;

    const matches = document.cookie.match(
      new RegExp(
        `(?:^|; )${name.replace(/([.$?*|{}()\[\]\\/+^])/g, '\\$1')}=([^;]*)`
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  /**
   * Check if a cookie exists.
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }
}