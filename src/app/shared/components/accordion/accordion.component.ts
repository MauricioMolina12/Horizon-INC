import {
  Component,
  Input,
  Output,
  EventEmitter,
  computed,
  booleanAttribute,
  ContentChild,
  TemplateRef,
  effect,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export type AccordionState = 'open' | 'closed' | 'disabled';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionComponent {
  /** Unique identifier for the accordion item */
  @Input() accordionId = '';

  /** Icon class (e.g. 'ti ti-user') shown before the title */
  @Input() icon = '';

  /** Title text displayed in the trigger header */
  @Input() title = '';

  /** Optional description shown below the title */
  @Input() description = '';

  /** Visual style: normal | danger */
  @Input() variant: 'normal' | 'danger' = 'normal';

  /** Whether the section is expanded — fully externally controlled */
  @Input({ transform: booleanAttribute }) isOpen = false;

  /** Manually control disabled state */
  @Input({ transform: booleanAttribute }) disabled = false;

  /** Emits when the accordion toggles */
  @Output() toggled = new EventEmitter<boolean>();

  /** Emits the current open state whenever it changes */
  @Output() openChange = new EventEmitter<boolean>();

  /** Reference to custom header template (optional) */
  @ContentChild('accordionHeader') headerTemplate?: TemplateRef<unknown>;

  /** Reference to body content template (optional) */
  @ContentChild('accordionContent') contentTemplate?: TemplateRef<unknown>;

  /** Computed state string for consumers */
  readonly state = computed<AccordionState>(() => {
    if (this.disabled) return 'disabled';
    return this.isOpen ? 'open' : 'closed';
  });

  /** Toggle the accordion — emits event for parent to handle */
  toggle(): void {
    if (this.disabled) return;

    const next = !this.isOpen;
    this.toggled.emit(next);
    this.openChange.emit(next);
  }

  /** Emit open event */
  open(): void {
    if (this.disabled) return;
    this.openChange.emit(true);
  }

  /** Emit close event */
  close(): void {
    this.openChange.emit(false);
  }
}