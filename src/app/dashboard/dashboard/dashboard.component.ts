import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BookingComponent } from '../components/booking/booking.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ScanningsComponent } from '../components/scannings/scannings.component';
import { Language, LanguageService } from '../../shared/services/language.service';
import { ActivatedRoute, Router } from '@angular/router';

type DashboardTab = 'profile' | 'booking' | 'scannings';

interface DashboardCopy {
  profile: string;
  booking: string;
  scannings: string;
}

const DASHBOARD_COPY: Record<Language, DashboardCopy> = {
  da: {
    profile: 'Profil',
    booking: 'Booking',
    scannings: 'Scanninger',
  },
  en: {
    profile: 'Profile',
    booking: 'Booking',
    scannings: 'Scans',
  },
};

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProfileComponent, ScanningsComponent, BookingComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly languageService = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  activeTab: DashboardTab = 'profile';
  showScans = true;

  readonly content = computed(() => DASHBOARD_COPY[this.languageService.language()]);

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const nextTab = params.get('tab');

      if (nextTab === 'profile' || nextTab === 'booking' || nextTab === 'scannings') {
        if (nextTab === 'scannings' && !this.showScans) {
          this.activeTab = 'profile';
          return;
        }

        this.activeTab = nextTab;
        return;
      }

      this.activeTab = 'profile';
    });
  }

  setActiveTab(tab: DashboardTab): void {
    if (tab === 'scannings' && !this.showScans) {
      return;
    }

    this.activeTab = tab;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }

  updateScansVisibility(showScans: boolean): void {
    this.showScans = showScans;

    if (!this.showScans && this.activeTab === 'scannings') {
      this.activeTab = 'profile';
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { tab: 'profile' },
        queryParamsHandling: 'merge',
      });
    }
  }
}
