import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../../shared/models/auth-user.model';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectAuthUser = createSelector(
  selectUserState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (state) => state.isAuthenticated
);

export const selectAuthLoading = createSelector(
  selectUserState,
  (state) => state.loading
);

export const selectAuthSaving = createSelector(
  selectUserState,
  (state) => state.saving
)

export const selectAuthLoaded = createSelector(
  selectUserState,
  (state) => state.loaded
);

export const selectAuthError = createSelector(
  selectUserState,
  (state) => state.error
);
