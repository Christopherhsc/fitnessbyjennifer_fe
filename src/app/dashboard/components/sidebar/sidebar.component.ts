import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface SidebarCopy {
  title: string;
  subtitle: string;
  profile: string;
  scannings: string;
  booking: string;
}

const SIDEBAR_COPY: Record<Language, SidebarCopy> = {
  da: {
    title: 'Mit dashboard',
    subtitle: 'Overblik over profil, scanninger og bookinger.',
    profile: 'Profil',
    scannings: 'Scanninger',
    booking: 'Booking',
  },
  en: {
    title: 'My dashboard',
    subtitle: 'Overview of your profile, scans, and bookings.',
    profile: 'Profile',
    scannings: 'Scans',
    booking: 'Booking',
  },
};

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',

  imports: [CommonModule]
})
export class SidebarComponent {
  private readonly languageService = inject(LanguageService);

  @Input() showScans: boolean = true;
  @Input() activeTab: 'profile' | 'booking' | 'scannings' = 'profile';
  @Output() tabChange = new EventEmitter<'profile' | 'booking' | 'scannings'>();

  readonly content = computed(() => SIDEBAR_COPY[this.languageService.language()]);

  setTab(tab: 'profile' | 'booking' | 'scannings'): void {
    if (tab === 'scannings' && !this.showScans) return;
    this.tabChange.emit(tab);
  }
}
