import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface AuthUser {
  name: string | null;
  email: string | null;
  picture: string | null;
  role?: number | null;
}

interface PersistedAuthUserResponse {
  user: {
    email: string;
    name: string;
    picture: string | null;
    role: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly accessTokenKey = 'googleAccessToken';
  private readonly userStorageKey = 'googleUser';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<AuthUser>({
    name: null,
    email: null,
    picture: null,
  });

  isLoggedIn$ = this.loggedIn.asObservable();
  user$ = this.user.asObservable();

  constructor(private router: Router) {}

  async login(accessToken: string, userData: AuthUser): Promise<void> {
    const persistedUser = await this.persistUser(userData);
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.userStorageKey, JSON.stringify(persistedUser));
    this.loggedIn.next(true);
    this.user.next(persistedUser);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.userStorageKey);
    this.loggedIn.next(false);
    this.user.next({ name: null, email: null, picture: null });

    this.router.navigate(['/']).then(() => {
      setTimeout(() => window.location.reload(), 500);
    });
  }

  checkLoginStatus(): void {
    const accessToken = localStorage.getItem(this.accessTokenKey);
    const storedUser = localStorage.getItem(this.userStorageKey);

    if (!accessToken || !storedUser) {
      this.loggedIn.next(false);
      this.user.next({ name: null, email: null, picture: null });
      return;
    }

    try {
      const userData = JSON.parse(storedUser) as AuthUser;
      this.loggedIn.next(true);
      this.user.next(userData);
    } catch {
      this.logout();
    }
  }

  isAuthenticated(): boolean {
    return this.loggedIn.value;
  }

  private async persistUser(userData: AuthUser): Promise<AuthUser> {
    if (!userData.email || !userData.name) {
      throw new Error('Authenticated user is missing name or email.');
    }

    const response = await firstValueFrom(
      this.http.post<PersistedAuthUserResponse>(`${environment.apiBaseUrl}/auth/google-user`, {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      })
    );

    return {
      email: response.user.email,
      name: response.user.name,
      picture: response.user.picture,
      role: response.user.role,
    };
  }
}
