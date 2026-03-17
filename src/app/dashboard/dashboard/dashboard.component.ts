import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BookingComponent } from '../components/booking/booking.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { ScanningsComponent } from '../components/scannings/scannings.component';
import { Language, LanguageService } from '../../shared/services/language.service';

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

  activeTab: DashboardTab = 'profile';
  showScans = true;

  readonly content = computed(() => DASHBOARD_COPY[this.languageService.language()]);

  setActiveTab(tab: DashboardTab): void {
    if (tab === 'scannings' && !this.showScans) {
      return;
    }

    this.activeTab = tab;
  }

  updateScansVisibility(showScans: boolean): void {
    this.showScans = showScans;

    if (!this.showScans && this.activeTab === 'scannings') {
      this.activeTab = 'profile';
    }
  }
}
