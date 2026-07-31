import {
  Component,
  computed,
  effect,
  input,
  signal,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { ToastService } from './toast.service';
import { Toast } from './toast.types';

/**
 * Individual pill-shaped toast item.
 * Handles its own auto-close timer and hover pause.
 */
@Component({
  selector: 'app-toast-item',
  standalone: true,
  template: `
    <div
      class="toast toast--{{ data().type }}"
      [class.toast--closable]="data().closable"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      role="status"
      [attr.aria-label]="data().title"
    >
      @if (data().showIcon) {
        <span class="toast__icon" aria-hidden="true">
          @switch (data().type) {
            @case ('info') {
              <i class="ti ti-info-circle"></i>
            }
            @case ('success') {
              <i class="ti ti-circle-check"></i>
            }
            @case ('danger') {
              <i class="ti ti-alert-circle"></i>
            }
            @case ('warning') {
              <i class="ti ti-alert-triangle"></i>
            }
          }
        </span>
      }

      <div class="toast__content">
        <p class="toast__title">{{ data().title }}</p>
        @if (data().description) {
          <p class="toast__description">{{ data().description }}</p>
        }
      </div>

      @if (data().closable) {
        <button
          type="button"
          class="toast__close"
          (click)="remove()"
          aria-label="Cerrar notificación"
        >
          <i class="ti ti-x"></i>
        </button>
      }

      <!-- @if (data().autoClose) {
        <div
          class="toast__progress"
          [class.toast__progress--paused]="paused()"
        >
          <span
            class="toast__progress-bar"
            [style.animation-duration]="durationMs() + 'ms'"
            [style.animation-play-state]="paused() ? 'paused' : 'running'"
          ></span>
        </div>
      } -->
    </div>
  `,
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastItemComponent {
  readonly toast = input.required<Toast>();
  private toastService = inject(ToastService);

  readonly data = computed(() => this.toast());
  readonly paused = signal(false);
  readonly durationMs = computed(() => this.toast().duration ?? 4000);

  private timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      this.setupTimer(this.toast());
    });
  }

  private setupTimer(toast: Toast): void {
    this.clearTimer();

    if (!toast.autoClose) return;

    this.timerId = setTimeout(() => {
      this.toastService.remove(toast.id);
    }, toast.duration ?? 4000);
  }

  onMouseEnter(): void {
    if (!this.toast().pauseOnHover) return;
    this.paused.set(true);
    this.clearTimer();
  }

  onMouseLeave(): void {
    if (!this.toast().pauseOnHover) return;
    this.paused.set(false);
    this.setupTimer(this.toast());
  }

  remove(): void {
    this.toastService.remove(this.toast().id);
  }

  private clearTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}