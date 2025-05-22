import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router'; // thêm router để redirect
import { environment } from '../environment'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private apiUrl = 'http://localhost:8080/api';
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { // inject Router
    const user = localStorage.getItem('currentUser');
    if (user && user !== 'undefined') {
      try {
        this.currentUserSubject.next(JSON.parse(user));
      } catch (e) {
        console.error('Failed to parse currentUser from localStorage:', e);
        localStorage.removeItem('currentUser');
        this.router.navigate(['/login']); // redirect nếu parse lỗi
      }
    }
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  register(user: User): Observable<AuthResponse> {
    const request = {
      header: { requestId: this.generateRequestId() },
      body: { username: user.username, email: user.email, password: user.password }
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, request);
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const request = {
      header: { requestId: this.generateRequestId() },
      body: { email: credentials.email, password: credentials.password }
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        if (response.res_code.error_code === "00") {
          localStorage.setItem('token', response.data.Result);
          this.getUserProfile().subscribe({
            next: user => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
            },
            error: err => {
              console.error('Failed to fetch user after login:', err);
              localStorage.removeItem('currentUser');
              localStorage.removeItem('token');
              this.currentUserSubject.next(null);
              this.router.navigate(['/login']);
            }
          });
        }
      }),
      catchError(err => {
        console.error('Login failed:', err);
        return throwError(() => new Error('Login failed'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // thêm logic check token hợp lệ nếu cần (dùng jwt-decode chẳng hạn)
    return true;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserProfile(): Observable<User> {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
      catchError(err => {
        console.error('Failed to fetch user profile:', err);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
        return throwError(() => new Error('Failed to fetch user profile'));
      })
    );
  }

  updateUserProfile(user: User): Observable<User> {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const request = {
      header: { requestId: this.generateRequestId() },
      body: { username: user.username, email: user.email }
    };
    return this.http.put<User>(`${this.apiUrl}/users/me`, request, { headers }).pipe(
      tap(updatedUser => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(err => {
        console.error('Failed to update user profile:', err);
        this.router.navigate(['/login']);
        return throwError(() => new Error('Failed to update user profile'));
      })
    );
  }

  // forgotPassword(email: string): Observable<any> {
  //   const request = {
  //     header: { requestId: this.generateRequestId() },
  //     body: { email }
  //   };
  //   return this.http.post(`${this.apiUrl}/auth/forgot-password`, request).pipe(
  //     catchError(err => {
  //       console.error('Failed to send forgot password request:', err);
  //       return throwError(() => new Error('Failed to send forgot password request'));
  //     })
  //   );
  // }
  forgotPassword(email: string): Observable<any> {
    const request = {
      header: { requestId: this.generateRequestId() },
      body: { email }
    };
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, request).pipe(
      catchError(err => {
        console.error('Failed to send forgot password request:', err);
        return throwError(() => new Error(err.error?.res_code?.error_desc || 'Failed to send forgot password request'));
      })
    );
  }

  // resetPassword(token: string, newPassword: string): Observable<any> {
  //   const request = {
  //     header: { requestId: this.generateRequestId() },
  //     body: { token, newPassword }
  //   };
  //   return this.http.post(`${this.apiUrl}/auth/reset-password`, request).pipe(
  //     catchError(err => {
  //       console.error('Failed to reset password:', err);
  //       return throwError(() => new Error('Failed to reset password'));
  //     })
  //   );
  // }
  resetPassword(token: string, newPassword: string): Observable<any> {
    const params = { token, newPassword }; // Sử dụng params thay vì body
    return this.http.post(`${this.apiUrl}/auth/reset-password`, null, { params }).pipe(
      catchError(err => {
        console.error('Failed to reset password:', err);
        return throwError(() => new Error(err.error?.ErrorMess || 'Failed to reset password'));
      })
    );
  }
}
