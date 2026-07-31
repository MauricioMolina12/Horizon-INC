export type ToastType = 'info' | 'success' | 'danger' | 'warning';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastOptions {
  /** Where the toast appears. */
  position?: ToastPosition;
  /** Auto-dismiss after `duration` ms. */
  autoClose?: boolean;
  /** Time in ms before auto-dismiss (default 4000). */
  duration?: number;
  /** Show an icon matching the toast type. */
  showIcon?: boolean;
  /** Allow manual close button. */
  closable?: boolean;
  /** Pause the auto-close timer while hovering. */
  pauseOnHover?: boolean;
}

export interface Toast extends ToastOptions {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}