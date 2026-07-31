import { User } from '../../../shared/models/auth-user.model';

export type ProfileUser = User;

export interface ProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  updating: boolean;
  ordersLoaded: boolean;
  statsLoaded: boolean;
  timelineLoaded: boolean;
  insightsLoaded: boolean;
  recommendationsLoaded: boolean;
}