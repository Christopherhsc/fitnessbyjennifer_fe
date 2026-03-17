import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnInit, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { Language, LanguageService } from '../../services/language.service';

interface NavLink {
  id: string;
  label: string;
}

interface HeaderCopy {
  navLinks: NavLink[];
  openMenuLabel: string;
  dashboard: string;
  page: string;
  profile: string;
  scannings: string;
  booking: string;
  login: string;
  comingSoon: string;
  logout: string;
  toggleLabel: string;
}

const HEADER_COPY: Record<Language, HeaderCopy> = {
  da: {
    navLinks: [
      { id: 'home', label: 'Hjem' },
      { id: 'about', label: 'Om mig' },
      { id: 'services', label: 'Ydelser' },
      { id: 'review', label: 'Anmeldelser' },
      { id: 'contact', label: 'Kontakt' },
    ],
    openMenuLabel: 'Åbn menu',
    dashboard: 'Dashboard',
    page: 'Forside',
    profile: 'Profil',
    scannings: 'Scanninger',
    booking: 'Booking',
    login: 'Log ind',
    comingSoon: 'Kommer',
    logout: 'Log ud',
    toggleLabel: 'Skift sprog',
  },
  en: {
    navLinks: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'services', label: 'Services' },
      { id: 'review', label: 'Reviews' },
      { id: 'contact', label: 'Contact' },
    ],
    openMenuLabel: 'Open menu',
    dashboard: 'Dashboard',
    page: 'Landing page',
    profile: 'Profile',
    scannings: 'Scans',
    booking: 'Booking',
    login: 'Log in',
    comingSoon: 'Soon',
    logout: 'Log out',
    toggleLabel: 'Switch language',
  },
};

interface GoogleUserProfile {
  name?: string;
  given_name?: string;
  email?: string;
  picture?: string;
}

interface GoogleTokenResponse {
  access_token?: string;
  error?: string;
}

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnInit, AfterViewInit {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => HEADER_COPY[this.languageService.language()]);
  readonly navLinks = computed(() => this.content().navLinks);
  readonly currentLanguage = this.languageService.language;

  activeLink = 'home';
  isMenuOpen = false;
  isLoggedIn = false;
  isScrolled = false;
  currentUrl = '/';
  readonly hasGoogleAuth = Boolean(environment.googleClientId);
  showComingSoon = false;
  private tokenClient?: google.accounts.oauth2.TokenClient;
  private comingSoonTimeoutId?: number;

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.currentUrl = this.router.url;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  ngAfterViewInit(): void {
    this.ensureGoogleLibrary(() => {
      this.initializeGoogleSignIn();
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

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  navigateLoggedIn(tab?: 'profile' | 'scannings' | 'booking'): void {
    this.isMenuOpen = false;

    if (tab) {
      void this.router.navigate(['/dashboard'], {
        queryParams: {
          tab,
        },
      });
      return;
    }

    void this.router.navigate([this.isDashboardRoute() ? '/' : '/dashboard']);
  }

  loginWithGoogle(): void {
    if (!this.hasGoogleAuth) {
      this.showComingSoon = true;
      window.clearTimeout(this.comingSoonTimeoutId);
      this.comingSoonTimeoutId = window.setTimeout(() => {
        this.showComingSoon = false;
      }, 3500);
      return;
    }

    if (!this.tokenClient) {
      console.error('Google Sign-In library is not loaded.');
      return;
    }

    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  logout(): void {
    const accessToken = localStorage.getItem('googleAccessToken');
    if (accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessToken, () => {});
    }

    this.authService.logout();
  }

  isDashboardRoute(): boolean {
    return this.currentUrl.startsWith('/dashboard');
  }

  isDashboardTab(tab: 'profile' | 'scannings' | 'booking'): boolean {
    return this.currentUrl.includes(`tab=${tab}`);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 24;
    this.updateActiveSection();
  }

  trackLink(index: number): number {
    return index;
  }

  private initializeGoogleSignIn(): void {
    if (!environment.googleClientId) {
      console.error('Missing Google Client ID in environment.googleClientId');
      return;
    }

    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: environment.googleClientId,
      scope: 'openid profile email',
      callback: async (response: GoogleTokenResponse) => {
        if (!response.access_token || response.error) {
          console.error('Google authentication failed.', response.error);
          return;
        }

        await this.handleGoogleLogin(response.access_token);
      },
    });
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

    for (const link of [...this.navLinks()].reverse()) {
      const section = document.getElementById(link.id);
      if (!section) {
        continue;
      }

      if (scrollPosition >= section.offsetTop) {
        this.activeLink = link.id;
        return;
      }
    }

    this.activeLink = this.navLinks()[0].id;
  }

  private async handleGoogleLogin(accessToken: string): Promise<void> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch Google user profile.');
      }

      const profile = (await response.json()) as GoogleUserProfile;
      await this.authService.login(accessToken, {
        name: profile.given_name ?? profile.name ?? null,
        email: profile.email ?? null,
        picture: profile.picture ?? null,
      });

      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Google login failed.', error);
    }
  }
}

declare global {
  namespace google.accounts.oauth2 {
    interface TokenClient {
      requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
    }
  }

  interface Window {
    google: any;
  }
}
