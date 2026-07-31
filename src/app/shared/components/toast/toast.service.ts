import { Injectable, signal } from '@angular/core';
import { Toast, ToastOptions, ToastType } from './toast.types';

export interface ToastInput {
  title: string;
  description?: string;
  type?: ToastType;
}

export interface ToastGlobalConfig extends ToastOptions {
  maxToasts?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  /** Stack of active toasts. */
  readonly toasts = signal<Toast[]>([]);

  /** Global defaults applied to every toast. */
  defaults: ToastGlobalConfig = {
    position: 'top-right',
    autoClose: true,
    duration: 4000,
    showIcon: true,
    closable: true,
    pauseOnHover: true,
    maxToasts: 5,
  };

  /**
   * Show a toast.
   *
   * @example
   * toast.show({ title: 'Guardado', description: 'Cambios aplicados', type: 'success' });
   */
  show(
    input: ToastInput,
    options?: ToastOptions,
  ): string {
    const id = crypto.randomUUID();
    const toast: Toast = {
      id,
      title: input.title,
      description: input.description,
      type: input.type ?? 'info',
      ...this.defaults,
      ...options,
    };

    this.toasts.update((current) => {
      const next = [...current, toast];
      const max = this.defaults.maxToasts ?? 5;
      return next.length > max ? next.slice(next.length - max) : next;
    });

    return id;
  }

  /** Convenience: info toast. */
  info(title: string, description?: string, options?: ToastOptions): string {
    return this.show({ title, description, type: 'info' }, options);
  }

  /** Convenience: success toast. */
  success(title: string, description?: string, options?: ToastOptions): string {
    return this.show({ title, description, type: 'success' }, options);
  }

  /** Convenience: danger toast. */
  danger(title: string, description?: string, options?: ToastOptions): string {
    return this.show({ title, description, type: 'danger' }, options);
  }

  /** Convenience: warning toast. */
  warning(title: string, description?: string, options?: ToastOptions): string {
    return this.show({ title, description, type: 'warning' }, options);
  }

  /** Remove a toast by id. */
  remove(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  /** Remove all toasts. */
  clear(): void {
    this.toasts.set([]);
  }
}