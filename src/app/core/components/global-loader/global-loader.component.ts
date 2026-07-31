import { Component, computed, inject } from '@angular/core';
import { GlobalLoaderService } from '../../services/global-loader.service';

@Component({
    selector: 'app-global-loader',
    template: `
    @if (isVisible()) {
      <div class="global-loader">
        <img src="assets/logo-holnex.svg" alt="Holnex">
      </div>
    }
    `,
    styleUrls: ['./global-loader.component.scss'],
    standalone: false
})
export class GlobalLoaderComponent {
  private globalLoader = inject(GlobalLoaderService);
  isVisible = computed(() => this.globalLoader.isVisible());
}