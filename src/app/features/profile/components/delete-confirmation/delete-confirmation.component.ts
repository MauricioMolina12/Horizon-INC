import { Component, inject } from '@angular/core';
import { ProfileFacade } from '../../../profile/services/profile.facade';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <div class="delete-confirmation">
      <h2 class="delete-confirmation__title">Eliminar cuenta</h2>
      <span class="delete-confirmation__desc">
        Esta acción es permanente, por lo que no podrás recuperar tu
        cuenta</span>
      <!-- <div class="delete-confirmation__icon">
        <i class="ti ti-alert-triangle"></i>
      </div> -->
      <div class="delete-confirmation__actions">
        <app-button [text]="'Cancelar'" [variant]="'ghost'" (clicked)="cancel()"></app-button>
        <app-button [text]="deleting ? 'Eliminando' : 'Eliminar'"           [disabled]="deleting"[variant]="'danger'" (clicked)="confirmDelete()"></app-button>
      </div>
      @if (error) {
        <p class="delete-confirmation__error">
          <i class="ti ti-alert-circle"></i>
          {{ error }}
        </p>
      }
    </div>
  `,
  styles: [
    `
      .delete-confirmation {
        padding: 24px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 16px;
      }
      .delete-confirmation__icon i {
        font-size: 48px;
        color: var(--color-danger);
      }
      .delete-confirmation__title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: var(--text-primary);
      }
      .delete-confirmation__desc {
        margin: 0;
        font-size: 14px;
        color: var(--text-secondary);
        text-align: start;
      }

      .delete-confirmation__actions {
        display: flex;
        gap: 12px;
        width: 100%;
        justify-content: space-between;
      }

      .delete-confirmation__error {
        margin: 0;
        font-size: 13px;
        color: var(--color-danger);
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .spinner {
        animation: spin 0.6s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class DeleteConfirmationComponent {
  private profileFacade = inject(ProfileFacade);
  private modalService = inject(ModalService);

  deleting = false;
  error: string | null = null;

  cancel(): void {
    this.modalService.close();
  }

  confirmDelete(): void {
    const u = this.profileFacade.currentUser();
    if (!u) return;

    this.deleting = true;
    this.error = null;

    this.profileFacade.deleteAccount(u.id);

    this.modalService.close();
  }
}
