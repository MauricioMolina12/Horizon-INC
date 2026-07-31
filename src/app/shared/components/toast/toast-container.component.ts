import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from './toast.service';
import { ToastItemComponent } from './toast.component';
import { Toast, ToastPosition } from './toast.types';

const POSITIONS: ToastPosition[] = [
  'top-right',
  'top-left',
  'bottom-right',
  'bottom-left',
  'top-center',
  'bottom-center',
];

/**
 * Fixed container that renders all active toasts grouped by position.
 * Add once to the root component template.
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastItemComponent],
  template: `
    <div class="toast-container toast-container--visible">
      @for (position of positions; track position) {
        @if (toastsByPosition()[position]?.length) {
          <div class="toast-region toast-region--{{ position }}">
            @for (toast of toastsByPosition()[position]; track toast.id) {
              <app-toast-item [toast]="toast" />
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        inset: 0;
        z-index: 11000;
        pointer-events: none;
      }

      .toast-region {
        position: absolute;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: auto;
      }

      .toast-region--top-right {
        top: 16px;
        right: 16px;
        align-items: flex-end;
      }

      .toast-region--top-left {
        top: 16px;
        left: 16px;
        align-items: flex-start;
      }

      .toast-region--bottom-right {
        bottom: 16px;
        right: 16px;
        align-items: flex-end;
      }

      .toast-region--bottom-left {
        bottom: 16px;
        left: 16px;
        align-items: flex-start;
      }

      .toast-region--top-center {
        top: 16px;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
      }

      .toast-region--bottom-center {
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  readonly positions = POSITIONS;

  readonly toastsByPosition = computed(() => {
    const all = this.toastService.toasts();
    const grouped: Record<string, Toast[]> = {};

    for (const t of all) {
      const key = t.position ?? 'top-right';
      (grouped[key] ??= []).push(t);
    }

    return grouped;
  });
}