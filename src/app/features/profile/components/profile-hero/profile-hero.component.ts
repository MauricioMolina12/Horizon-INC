import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { User } from '../../../../shared/models/auth-user.model';

@Component({
  selector: 'app-profile-hero',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile-hero.component.html',
  styleUrl: './profile-hero.component.scss'
})
export class ProfileHeroComponent {
  readonly user         = input<User | null>(null);
  readonly loading      = input<boolean>(true);
  readonly avatarChange = output<void>();

  readonly showEditBtn = signal(false);
}