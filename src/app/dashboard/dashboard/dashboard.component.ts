import { Component } from '@angular/core';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { BookingComponent } from '../components/booking/booking.component';
import { ScanningsComponent } from '../components/scannings/scannings.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebarComponent, ProfileComponent, ScanningsComponent, BookingComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  activeTab: 'profile' | 'booking' | 'scannings' = 'profile';
  showScans: boolean = true; // ✅ Default to true

  setActiveTab(tab: 'profile' | 'booking' | 'scannings'): void {
    // ✅ Prevent switching to 'scannings' if it's hidden
    if (tab === 'scannings' && !this.showScans) {
      return;
    }
    this.activeTab = tab;
  }

  updateScansVisibility(showScans: boolean): void {
    this.showScans = showScans;

    // ✅ If the current tab is 'scannings' and we disable it, switch to 'profile'
    if (!this.showScans && this.activeTab === 'scannings') {
      this.activeTab = 'profile';
    }
  }
}
