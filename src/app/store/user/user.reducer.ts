import { createReducer, on } from '@ngrx/store';
import { UserState } from '../../shared/models/auth-user.model';
import {
  checkSession,
  checkSessionFailure,
  checkSessionNoSession,
  checkSessionSuccess,
  clearAuthUser,
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
  setAuthUser,
  updateAuthUser,
  updateAuthUserFailure,
  updateAuthUserSuccess,
} from './user.actions';

export const initialUserState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  deleting: false
};

export const userReducer = createReducer(
  initialUserState,

  on(initSessionFromCookies, (state) => ({ ...state, loading: true, error: null })),

  // ── Session check ──
  on(checkSession, (state) => ({ ...state, loading: true, error: null })),
  on(checkSessionSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, loading: false, loaded: true, error: null,
  })),
  on(checkSessionNoSession, (state) => ({
    ...state, loading: false, loaded: true, isAuthenticated: false,
  })),
  on(checkSessionFailure, (state, { error }) => ({
    ...state, loading: false, loaded: true, error,
  })),

  on(loadUserFromCache, (state) => ({ ...state, loading: true, error: null })),
  on(loadUserFromCacheFound, (state, { user }) => ({
    ...state, user, isAuthenticated: true, loading: false, loaded: true, error: null,
  })),
  on(loadUserFromCacheNotFound, (state) => ({
    ...state, loading: false, error: null,
  })),


  on(getUserById, (state) => ({ ...state, loading: true, error: null })),
  on(getUserByIdSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, loading: false, loaded: true, error: null,
  })),
  on(getUserByIdNotFound, (state) => ({
    ...state, loading: false, loaded: true, isAuthenticated: false, user: null,
  })),
  on(getUserByIdFailure, (state, { error }) => ({
    ...state, loading: false, loaded: true, error,
  })),

  // ── Login ──
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { user }) => ({
    ...state, user, isAuthenticated: true, loading: false, loaded: true, error: null,
  })),
  on(loginFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // ── Logout ──
  on(logout, (state) => ({ ...state, loading: true })),
  on(logoutSuccess, () => ({ ...initialUserState, loaded: true })),

  on(loadAuthUser, (state) => ({ ...state, loading: true, error: null })),
  on(loadAuthUserSuccess, (state, { user }) => ({ ...state, loading: false, loaded: true, user })),
  on(loadAuthUserFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(updateAuthUser,        (state)            => ({ ...state, saving: true, error: null })),
  on(updateAuthUserSuccess, (state, { user })  => ({ ...state, saving: false, user: { ...state.user, ...user }, error: null })),
  on(updateAuthUserFailure, (state, { error }) => ({ ...state, saving: false, error })),
  on(setAuthUser,           (state, { user })  => ({ ...state, user: { ...state.user, ...user }, loaded: true, error: null })),

  on(deleteAccount, (state) => ({ ...state, deleting: true, error: null })),
  on(deleteAccountSuccess, () => initialUserState),
  on(deleteAccountFailure, (state, { error }) => ({ ...state, deleting: false, error })),

  on(clearAuthUser, () => initialUserState),
);