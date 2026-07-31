import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { selectAuthLoaded, selectIsAuthenticated } from '../../store/user/user.selectors';
import { combineLatest } from 'rxjs';
import { AuthService } from '../auth/auth.service';


export const authGuard: CanActivateFn = () => {
  const store       = inject(Store);
  const router      = inject(Router);
  const authService = inject(AuthService);

  return combineLatest([
    store.select(selectAuthLoaded),
    store.select(selectIsAuthenticated),
  ]).pipe(
    filter(([loaded]) => loaded),
    take(1),
    map(([, authenticated]) => {
      if (authenticated) return true;
      
      authService.redirectToSignIn();
      return false;
    })
  );
};
