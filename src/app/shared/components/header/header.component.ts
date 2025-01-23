import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  activeLink: string = '';
  isMenuOpen: boolean = false;

  // set toggled link active with styling
  setActive(link: string): void {
    this.activeLink = link;

    // Close the menu after 2 seconds on mobile
    if (this.isMenuOpen) {
      setTimeout(() => {
        this.isMenuOpen = false;
        console.log('Menu closed after clicking:', link);
      }, 1200);
    }
  }


  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log("is menu open?", this.isMenuOpen)
  }
}
