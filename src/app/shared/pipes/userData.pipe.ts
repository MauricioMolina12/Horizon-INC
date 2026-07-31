import { Pipe, PipeTransform } from '@angular/core';
import { User, UserRole } from '../models/auth-user.model';

/**
 * Raw response data from GET /users/{userId}/public
 */
export interface UserData {
  country_code: string;
  created_at: string;
  full_name: string;
  id: string;
  rating: string;
  role: string;
  username: string;
}

export interface UserResponse {
  status: boolean;
  data: UserData;
}


@Pipe({
  name: 'userData',
  standalone: true,
})
export class UserPipe implements PipeTransform {

  transform(data: UserData): User;
  transform(data: null | undefined): null;
  transform(data: UserData | null | undefined): User | null {
    if (!data) return null;

    return {
      id        : data.id,
      name      : data.full_name,
      email     : '',
      phone     : '',
      avatar    : null,
      role      : (data.role === 'user' ? 'buyer' : data.role) as UserRole,
      countryId : data.country_code,
      address   : '',
      username  : data.username,
      createdAt : data.created_at,
    };
  }
}