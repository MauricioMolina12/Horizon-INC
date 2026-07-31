import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'danger-outline'
  | 'success'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  imports: [NgClass],
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() text!: string;
  @Input() loading = false;
  @Input() disabled = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: string = 'button';
  @Input() fullWidth = false;
  @Input() pill = false;
  @Input() ariaLabel?: string;

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): Record<string, boolean> {
    return {
      'holnex-btn': true,
      [`variant-${this.variant}`]: true,
      [`size-${this.size}`]: true,
      'loading': this.loading,
      'full-width': this.fullWidth,
      'pill': this.pill,
      'icon-only': !!this.icon && !this.text,
    };
  }

  onClick(): void {
    if (!this.loading && !this.disabled) {
      this.clicked.emit();
    }
  }
}