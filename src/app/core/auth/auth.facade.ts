import { Injectable, Signal, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthCredentials } from './auth-provider';
import {
  checkSession,
  checkSessionNoSession,
  initSessionFromCookies,
  login,
  logout,
} from '../../store/user/user.actions';
import {
  selectAuthError,
  selectAuthLoaded,
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
} from '../../store/user/user.selectors';
import { User, UserRole } from '../../shared/models/auth-user.model';


@Injectable({ providedIn: 'root' })
export class AuthFacade {

  /** Current authenticated user, or `null`. */
  readonly currentUser: Signal<User | null>;

  readonly user_id    = computed(() => this.currentUser()?.id ?? null);

  /** Whether a valid session exists. */
  readonly isAuthenticated: Signal<boolean>;

  /** True while any auth operation is in flight. */
  readonly isLoading: Signal<boolean>;

  /** True once the initial session check has completed (success or failure). */
  readonly isLoaded: Signal<boolean>;

  /** Last auth error message, or `null`. */
  readonly error: Signal<string | null>;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.currentUser     = toSignal(this.store.select(selectAuthUser),          { initialValue: null  });
    this.isAuthenticated = toSignal(this.store.select(selectIsAuthenticated),   { initialValue: false });
    this.isLoading       = toSignal(this.store.select(selectAuthLoading),       { initialValue: false });
    this.isLoaded        = toSignal(this.store.select(selectAuthLoaded),        { initialValue: false });
    this.error           = toSignal(this.store.select(selectAuthError),         { initialValue: null  });

  }

  /**
   * Initialize session from cookies.
   */
  initSession(): void {
    this.store.dispatch(initSessionFromCookies());
  }

  /** Call once at app startup when using AuthProvider-based flow. */
  checkSession(): void {
    this.store.dispatch(checkSession());
  }

  /** Authenticate with email + password. */
  login(credentials: AuthCredentials): void {
    this.store.dispatch(login({ credentials }));
  }

  /**
   * Dispatch logout action. The effect handles POST + redirect.
   */
  logout(): void {
    this.store.dispatch(logout());
  }

  /** Mark auth state as loaded without authenticating (used during SSR). */
  markAsLoaded(): void {
    this.store.dispatch(checkSessionNoSession());
  }

  /** Whether the current user has the seller role. */
  readonly isSeller: Signal<boolean> = computed(() => this.currentUser()?.role === 'seller');

  /** Whether the current user has the admin role. */
  readonly isAdmin: Signal<boolean> = computed(() => this.currentUser()?.role === 'admin');

}