import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/auth-user.model';
import { UserPipe, UserResponse } from '../../shared/pipes/userData.pipe';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = environment.BASE_URL;

  private userPipe = new UserPipe();

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<User> {
    return this.http
      .get<UserResponse>(`${this.baseUrl}/users/${userId}/public`)
      .pipe(map((response) => this.userPipe.transform(response.data)!));
  }


  updateUser(userId: string, data: Record<string, unknown>): Observable<User> {
    return this.http
      .put<UserResponse>(`${this.baseUrl}/users/${userId}`, { data })
      .pipe(map((response) => this.userPipe.transform(response.data)!));
  }

  /**
   * Delete user account.
   */
  deleteAccount(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }
}