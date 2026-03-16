import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
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
  readonly navLinks = [
    { id: 'home', label: 'Hjem' },
    { id: 'about', label: 'Om mig' },
    { id: 'services', label: 'Ydelser' },
    { id: 'review', label: 'Anmeldelser' },
    { id: 'contact', label: 'Kontakt' },
  ];

  activeLink = 'home';
  isMenuOpen = false;
  isLoggedIn = false;
  isScrolled = false;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    window['handleCredentialResponse'] = (response: any) => {
      this.authService.login(response.credential);
      this.router.navigate(['/dashboard']);
    };
  }

  ngAfterViewInit(): void {
    this.ensureGoogleLibrary(() => {
      this.loadGoogleSignIn();
    });

    this.updateActiveSection();
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
      window.google.accounts.id.disableAutoSelect();

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

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 24;
    this.updateActiveSection();
  }

  trackLink(index: number): number {
    return index;
  }

  private loadGoogleSignIn(): void {
    if (window.google && window.google.accounts.id) {
      window.google.accounts.id.revoke();

      window.google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: window['handleCredentialResponse'],
        ux_mode: 'popup',
        itp_support: true,
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

  private updateActiveSection(): void {
    const headerOffset = 180;
    const scrollPosition = window.scrollY + headerOffset;

    for (const link of [...this.navLinks].reverse()) {
      const section = document.getElementById(link.id);
      if (!section) {
        continue;
      }

      if (scrollPosition >= section.offsetTop) {
        this.activeLink = link.id;
        return;
      }
    }

    this.activeLink = this.navLinks[0].id;
  }
}

declare global {
  interface Window {
    google: any;
    handleCredentialResponse: (response: any) => void;
  }
}
