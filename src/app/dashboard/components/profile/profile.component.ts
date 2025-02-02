import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  imports: [CommonModule, FormsModule]
})
export class ProfileComponent {
  firstName: string | null = null;
  email: string | null = null;
  profileImage: string | null = null;
  showScans: boolean = true;
  bookingReminders: boolean = false;
  phoneNumber: string = '';
  phoneError: string | null = null;

  @Output() scansVisibilityChange = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      this.firstName = user.name;
      this.email = user.email;
      this.profileImage = user.picture;
    });
  }

  /** ✅ Log settings whenever they change */
  profileSettings(): void {
    console.log(`showScans: ${this.showScans}, bookingReminders: ${this.bookingReminders}`);
    this.scansVisibilityChange.emit(this.showScans); // ✅ Emit changes
  }

  validatePhoneNumber(): void {
    // Remove any non-digit characters
    this.phoneNumber = this.phoneNumber.replace(/\D/g, '');

    // Check if it's exactly 8 digits
    if (this.phoneNumber.length > 8) {
      this.phoneNumber = this.phoneNumber.substring(0, 8);
    }

    // Show error message if not exactly 8 digits
    if (this.phoneNumber.length !== 8) {
      this.phoneError = 'Telefonnummeret skal være præcis 8 cifre.';
    } else {
      this.phoneError = null;
    }
  }
}
