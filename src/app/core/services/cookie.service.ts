import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Service for reading/deleting cookies from the browser.
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


  deleteCookie(name: string): void {
    if (!this.isBrowser) return;

    const expired = 'Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    const variants = [
      `${name}=; ${expired}; path=/; SameSite=Lax`,
      `${name}=; ${expired}; path=/; SameSite=None; Secure`,
      `${name}=; ${expired}; path=/auth; SameSite=Lax`,
      `${name}=; ${expired}; path=/auth; SameSite=None; Secure`,
    ];

    for (const v of variants) {
      document.cookie = v;
    }
  }

  deleteCookies(names: string[]): void {
    for (const n of names) {
      this.deleteCookie(n);
    }
  }
}