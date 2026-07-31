import { Injectable, Signal, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  selectAuthError,
  selectAuthUser,
  selectAuthSaving,
} from '../../../store/user/user.selectors';
import {
  updateAuthUser,
  deleteAccount,
} from '../../../store/user/user.actions';
import { AuthFacade } from '../../../core/auth';


@Injectable({ providedIn: 'root' })
export class ProfileFacade {

  readonly #store = inject(Store);

  private  authFacade = inject(AuthFacade);

  readonly currentUser = this.authFacade.currentUser;

  readonly isUpdating: Signal<boolean>;

  readonly error: Signal<string | null>;

  constructor() {
    this.isUpdating  = toSignal(this.#store.select(selectAuthSaving), { initialValue: false });
    this.error       = toSignal(this.#store.select(selectAuthError), { initialValue: null });
  }

  /**
   * Update user fields.
   * @param userId  The user ID.
   * @param data    Key-value map of fields to update.
   */
  updateUser(userId: string, data: Record<string, unknown>): void {
    this.#store.dispatch(updateAuthUser({ userId, data }));
  }


  deleteAccount(userId: string): void {
    this.#store.dispatch(deleteAccount({ userId }));
  }
}