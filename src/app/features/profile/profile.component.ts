import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthFacade } from '../../core/auth/auth.facade';
import { ProfileHeroComponent } from './components/profile-hero/profile-hero.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileHeroComponent, ProfileSettingsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private authFacade = inject(AuthFacade);

  readonly user = this.authFacade.currentUser;
  readonly loading = this.authFacade.isLoading;

  onAvatarChange(): void {}
}