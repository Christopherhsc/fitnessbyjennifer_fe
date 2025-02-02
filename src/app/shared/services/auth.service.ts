import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private user = new BehaviorSubject<{
    name: string | null;
    email: string | null;
    picture: string | null;
  }>({ name: null, email: null, picture: null });

  isLoggedIn$ = this.loggedIn.asObservable();
  user$ = this.user.asObservable();

  constructor(private router: Router) {}

  login(token: string): void {
    localStorage.setItem('authToken', token);
    this.loggedIn.next(true);

    const userData = this.decodeToken(token);
    if (userData) {
      this.user.next({
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
      });

      console.log(userData)

      // ✅ Store profile image in localStorage to avoid repeated requests
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('profileImage', userData.picture);
    }
  }

  private decodeToken(
    token: string
  ): { name: string; email: string; picture: string } | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      return {
        name: payload.given_name,
        email: payload.email,
        picture: payload.picture,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('profileImage');
    this.loggedIn.next(false);
    this.user.next({ name: null, email: null, picture: null });

    this.router.navigate(['/']).then(() => {
      setTimeout(() => window.location.reload(), 500);
    });
  }

  checkLoginStatus(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.loggedIn.next(true);

      // ✅ Use stored values to avoid excessive requests
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      const storedImage = localStorage.getItem('profileImage');

      if (storedName && storedImage) {
        this.user.next({
          name: storedName,
          email: storedEmail,
          picture: storedImage,
        });
      } else {
        const userData = this.decodeToken(token);
        if (userData) {
          this.user.next({
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
          });
        }
      }
    }
  }
}
