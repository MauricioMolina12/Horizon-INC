import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { AUTH_PROVIDER, AuthProvider } from '../../core/auth/auth-provider';
import { CookieService } from '../../core/services/cookie.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

import {
  checkSession,
  checkSessionFailure,
  checkSessionNoSession,
  checkSessionSuccess,
  clearUserCache,
  deleteAccount,
  deleteAccountFailure,
  deleteAccountSuccess,
  getUserById,
  getUserByIdFailure,
  getUserByIdNotFound,
  getUserByIdSuccess,
  initSessionFromCookies,
  loadAuthUser,
  loadAuthUserFailure,
  loadAuthUserSuccess,
  loadUserFromCache,
  loadUserFromCacheFound,
  loadUserFromCacheNotFound,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
  redirectToAuth,
  saveUserToCache,
  setAuthUser,
  updateAuthUser,
  updateAuthUserFailure,
  updateAuthUserSuccess,
} from './user.actions';
import { AuthService } from '../../core/auth/auth.service';
import { GlobalLoaderService } from '../../core/services/global-loader.service';

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

@Injectable()
export class UserEffects {
  initSessionFromCookies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initSessionFromCookies),
      switchMap(() => {
        const idToken = this.cookieService.getCookie('holnex_id_token');

        if (!idToken) {
          if (environment.authDomain !== environment.mainDomain) {
            return of(redirectToAuth());
          }
          return of(checkSessionNoSession());
        }

        const payload = decodeJwtPayload(idToken);

        if (!payload) {
          if (environment.authDomain !== environment.mainDomain) {
            return of(redirectToAuth());
          }
          return of(checkSessionNoSession());
        }

        const userId = payload['id'] as string;

        if (!userId) {
          if (environment.authDomain !== environment.mainDomain) {
            return of(redirectToAuth());
          }
          return of(checkSessionNoSession());
        }

        return of(loadUserFromCache({ userId }), getUserById({ userId }));
      }),
    ),
  );

  loadUserFromCache$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserFromCache),
      switchMap(({ userId }) =>
        from(this.indexedDbService.getUser(userId)).pipe(
          map((cachedUser) =>
            cachedUser
              ? loadUserFromCacheFound({ user: cachedUser })
              : loadUserFromCacheNotFound(),
          ),
        ),
      ),
    ),
  );

  saveUserToCache$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(saveUserToCache),
        tap(({ user }) => {
          this.indexedDbService.saveUser(user);
        }),
      ),
    { dispatch: false },
  );

  clearUserCache$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(clearUserCache),
        tap(() => {
          this.indexedDbService.clear();
        }),
      ),
    { dispatch: false },
  );

  redirectToAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(redirectToAuth),
        tap(() => {
          if (this.document?.defaultView) {
            this.document.defaultView.location.href = environment.authDomain;
          }
        }),
      ),
    { dispatch: false },
  );

  getUserById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserById),
      switchMap(({ userId }) =>
        this.userService.getUserById(userId).pipe(
          map((user) => getUserByIdSuccess({ user })),
          catchError((error) => {
            if (error.status === 404) {
              return of(getUserByIdNotFound({ userId }));
            }
            return of(
              getUserByIdFailure({
                error: error.message || 'Failed to get user',
              }),
            );
          }),
        ),
      ),
    ),
  );

  getUserByIdSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserByIdSuccess),
      switchMap(({ user }) =>
        of(checkSessionSuccess({ user, token: '' }), saveUserToCache({ user })),
      ),
    ),
  );

  getUserByIdNotFound$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserByIdNotFound),
      map(() => checkSessionNoSession()),
    ),
  );

  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkSession),
      switchMap(() =>
        this.authProvider.checkSession().pipe(
          map((result) =>
            result
              ? checkSessionSuccess({ user: result.user, token: result.token })
              : checkSessionNoSession(),
          ),
          catchError((error) =>
            of(
              checkSessionFailure({
                error: error.message || 'Session check failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ credentials }) =>
        this.authProvider.login(credentials).pipe(
          switchMap(({ user, token }) =>
            of(loginSuccess({ user, token }), saveUserToCache({ user })),
          ),
          catchError((error) =>
            of(loginFailure({ error: error.message || 'Login failed' })),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      tap(() => this.splashService.show()),
      switchMap(() =>
        this.authService.logout().pipe(
          switchMap(() => of(logoutSuccess(), clearUserCache())),
          catchError(() => of(logoutSuccess(), clearUserCache())),
        ),
      ),
    ),
  );

  logoutRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => {
          const statePayload = {
            returnUrl: window.location.href,
            source: 'core',
            nonce: crypto.randomUUID(),
          };
          const state          = btoa(JSON.stringify(statePayload));
          window.location.href = `${environment.authDomain}/?logout=true&state=${encodeURIComponent(state)}`;
        }),
      ),
    { dispatch: false },
  );

  // ── Update user ──────────────────────────────────────────────
  updateAuthUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAuthUser),
      switchMap(({ userId, data }) =>
        this.userService.updateUser(userId, data).pipe(
          tap((user) => console.log('Respuesta backend:', user)),
          map((user) => updateAuthUserSuccess({ user })),
        ),
      ),
    ),
  );

  // ── Delete account ───────────────────────────────────────────
  deleteAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAccount),
      switchMap(({ userId }) =>
        this.userService.deleteAccount(userId).pipe(
          switchMap(() => of(deleteAccountSuccess())),
          catchError((error) =>
            of(
              deleteAccountFailure({
                error: error.message || 'Failed to delete account',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteAccountSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteAccountSuccess),
        tap(() => {
          this.indexedDbService.clear();
          // Redirect immediately to sign-in — no logout API call needed
          if (this.document?.defaultView) {
            window.location.href = `${environment.authDomain}/signin`;
          }
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$         : Actions,
    private cookieService    : CookieService,
    private indexedDbService : IndexedDbService,
    private userService      : UserService,
    private authService      : AuthService,
    private splashService    : GlobalLoaderService,
    @Inject(AUTH_PROVIDER) private authProvider: AuthProvider,
    @Inject(DOCUMENT) private document: Document,
  ) {}
}
