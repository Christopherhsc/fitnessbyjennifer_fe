import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
})
export class LoginComponent implements OnInit, AfterViewInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Define the Google Sign-In callback function
    window['handleCredentialResponse'] = (response: any) => {
      console.log('Encoded JWT ID token: ' + response.credential);

      // You can decode or verify the token here and handle user authentication

      // Navigate to the dashboard after successful login
      this.router.navigate(['/dashboard']);
    };
  }

  ngAfterViewInit(): void {
    this.ensureGoogleLibrary(() => {
      this.loadGoogleSignIn();
    });
  }

  private loadGoogleSignIn(): void {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Initialize Google Sign-In
      window.google.accounts.id.initialize({
        client_id: '969681795892-m6fn46prh99jbkbimh93ss4m0guu0vu2.apps.googleusercontent.com',
        callback: window['handleCredentialResponse'],
        ux_mode: 'popup',
        login_uri: 'http://localhost:3000/api/login',
      });
  
      // Render the button dynamically
      window.google.accounts.id.renderButton(
        document.querySelector('.google-btn'), // Target the container
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    } else {
      console.error('Google Sign-In library is not loaded.');
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
