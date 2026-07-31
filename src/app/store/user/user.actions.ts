import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/models/auth-user.model';
import { AuthCredentials } from '../../core/auth/auth-provider';

// ── Session check (app init) ──────────────────────────────────
export const checkSession = createAction('[Auth] Check Session');
export const checkSessionSuccess = createAction('[Auth] Check Session Success', props<{ user: User; token: string }>());
export const checkSessionNoSession = createAction('[Auth] Check Session No Session');
export const checkSessionFailure = createAction('[Auth] Check Session Failure', props<{ error: string }>());

// ── Cookie-based auth flow ────────────────────────────────────
export const initSessionFromCookies = createAction('[Auth] Init Session From Cookies');
export const redirectToAuth = createAction('[Auth] Redirect To Auth');

// ── IndexedDB cache flow ──────────────────────────────────────
export const loadUserFromCache = createAction('[User] Load From Cache', props<{ userId: string }>());
export const loadUserFromCacheFound = createAction('[User] Load From Cache Found', props<{ user: User }>());
export const loadUserFromCacheNotFound = createAction('[User] Load From Cache Not Found');

export const saveUserToCache = createAction('[User] Save To Cache', props<{ user: User }>());
export const clearUserCache = createAction('[User] Clear Cache');

// ── Get user from API ─────────────────────────────────────────
export const getUserById = createAction('[User] Get User By Id', props<{ userId: string }>());
export const getUserByIdSuccess = createAction('[User] Get User By Id Success', props<{ user: User }>());
export const getUserByIdNotFound = createAction('[User] Get User By Id NotFound', props<{ userId: string }>());
export const getUserByIdFailure = createAction('[User] Get User By Id Failure', props<{ error: string }>());

// ── Login ─────────────────────────────────────────────────────
export const login = createAction('[Auth] Login', props<{ credentials: AuthCredentials }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: User; token: string }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());


// ── Logout ────────────────────────────────────────────────────
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// ── Load / update user (profile) ──────────────────────────────
export const loadAuthUser = createAction('[User] Load Auth User');
export const loadAuthUserSuccess = createAction('[User] Load Auth User Success', props<{ user: User }>());
export const loadAuthUserFailure = createAction('[User] Load Auth User Failure', props<{ error: string }>());

export const setAuthUser = createAction('[User] Set Auth User', props<{ user: User }>());

export const updateAuthUser = createAction('[User] Update Auth User', props<{ userId: string; data: Record<string, unknown> }>());
export const updateAuthUserSuccess = createAction('[User] Update Auth User Success', props<{ user: User }>());
export const updateAuthUserFailure = createAction('[User] Update Auth User Failure', props<{ error: string }>());

export const clearAuthUser = createAction('[User] Clear Auth User');

// ── Delete account ───────────────────────────────────────────
export const deleteAccount = createAction('[User] Delete Account', props<{ userId: string }>());
export const deleteAccountSuccess = createAction('[User] Delete Account Success');
export const deleteAccountFailure = createAction('[User] Delete Account Failure', props<{ error: string }>());
