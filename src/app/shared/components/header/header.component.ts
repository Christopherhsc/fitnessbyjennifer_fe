import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  activeLink: string = '';
  isMenuOpen: boolean = false;
  isLoggedIn: boolean = false; // Track login state

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to auth state
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    window['handleCredentialResponse'] = (response: any) => {
      console.log('Encoded JWT ID token:', response.credential);
      this.authService.login(response.credential); // Update auth state

      // Navigate to dashboard or home
      this.router.navigate(['/dashboard']);
    };
  }

  ngAfterViewInit(): void {
    this.ensureGoogleLibrary(() => {
      this.loadGoogleSignIn();
    });
  }

  setActive(link: string): void {
    this.isMenuOpen = false;
    this.activeLink = link;
    const targetElement = document.getElementById(link);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  loginWithGoogle(): void {
    if (window.google && window.google.accounts.id) {
      // Ensure the user is fully signed out before re-logging in
      window.google.accounts.id.disableAutoSelect();
  
      // Wait briefly before triggering login to allow session reset
      setTimeout(() => {
        window.google.accounts.id.prompt();
      }, 500);
    } else {
      console.error('Google Sign-In library is not loaded.');
    }
  }

  logout(): void {
    this.authService.logout();
  }

  private loadGoogleSignIn(): void {
    if (window.google && window.google.accounts.id) {
      // Force a fresh session by revoking any existing one
      window.google.accounts.id.revoke();
  
      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: window['handleCredentialResponse'],
        ux_mode: 'popup', // Avoid FedCM issues
        itp_support: true, // Improve cross-site cookie support
      });
    }
  }
  
  

  private ensureGoogleLibrary(callback: () => void): void {
    if (window.google && window.google.accounts) {
      callback();
    } else {
      const interval = setInterval(() => {
        if (window.google && window.google.accounts) {
          clearInterval(interval);
          callback();
        }
      }, 100);
    }
  }
}

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}
