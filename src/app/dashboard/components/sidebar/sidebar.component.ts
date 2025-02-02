import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',

  imports: [CommonModule]
})
export class SidebarComponent {
  @Input() showScans: boolean = true;
  @Output() tabChange = new EventEmitter<'profile' | 'booking' | 'scannings'>();
  activeTab: 'profile' | 'booking' | 'scannings' = 'profile'; 

  setTab(tab: 'profile' | 'booking' | 'scannings'): void {
    if (tab === 'scannings' && !this.showScans) return; // ✅ Prevent selecting hidden tab
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }
}
