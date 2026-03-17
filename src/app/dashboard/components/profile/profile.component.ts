import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface ProfileCopy {
  eyebrow: string;
  title: string;
  guest: string;
  introTitle: string;
  privacyTitle: string;
  privacyText: string;
  visibilityLabel: string;
  remindersTitle: string;
  remindersText: string;
  remindersLabel: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneHelp: string;
  phoneError: string;
}

const PROFILE_COPY: Record<Language, ProfileCopy> = {
  da: {
    eyebrow: 'Din profil',
    title: 'Et samlet overblik over dine personlige indstillinger',
    guest: 'Gæst',
    introTitle: 'Velkommen tilbage',
    privacyTitle: 'Privat og personligt',
    privacyText:
      'Oplysninger om scanninger og bookinger deles kun mellem dig og Jennifer.',
    visibilityLabel: 'Mine scanninger må vises på hjemmesiden',
    remindersTitle: 'Bookingpåmindelser',
    remindersText: 'Få en enkel SMS-påmindelse før dine kommende bookinger.',
    remindersLabel: 'Modtag bookingpåmindelser',
    phoneLabel: 'Telefonnummer',
    phonePlaceholder: 'Indtast 8 cifre',
    phoneHelp: 'Brug dit danske mobilnummer uden mellemrum.',
    phoneError: 'Telefonnummeret skal være præcis 8 cifre.',
  },
  en: {
    eyebrow: 'Your profile',
    title: 'A clear overview of your personal settings',
    guest: 'Guest',
    introTitle: 'Welcome back',
    privacyTitle: 'Private and personal',
    privacyText: 'Information about scans and bookings is shared only between you and Jennifer.',
    visibilityLabel: 'Allow my scans to be shown on the website',
    remindersTitle: 'Booking reminders',
    remindersText: 'Receive a simple SMS reminder before your upcoming bookings.',
    remindersLabel: 'Receive booking reminders',
    phoneLabel: 'Phone number',
    phonePlaceholder: 'Enter 8 digits',
    phoneHelp: 'Use your Danish mobile number without spaces.',
    phoneError: 'The phone number must be exactly 8 digits.',
  },
};

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [CommonModule, FormsModule],
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);

  firstName: string | null = null;
  email: string | null = null;
  profileImage: string | null = null;
  showScans = true;
  bookingReminders = false;
  phoneNumber = '';
  phoneError: string | null = null;

  readonly content = computed(() => PROFILE_COPY[this.languageService.language()]);

  @Output() scansVisibilityChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.firstName = user.name;
      this.email = user.email;
      this.profileImage = user.picture;
    });
  }

  profileSettings(): void {
    this.scansVisibilityChange.emit(this.showScans);
  }

  validatePhoneNumber(): void {
    this.phoneNumber = this.phoneNumber.replace(/\D/g, '');

    if (this.phoneNumber.length > 8) {
      this.phoneNumber = this.phoneNumber.substring(0, 8);
    }

    this.phoneError =
      this.phoneNumber.length > 0 && this.phoneNumber.length !== 8 ? this.content().phoneError : null;
  }
}
