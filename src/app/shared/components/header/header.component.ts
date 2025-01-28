import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
})
export class HeaderComponent implements OnInit, OnDestroy {
  activeLink: string = '';
  isMenuOpen: boolean = false;
  hideNavbar: boolean = false;
  private routeSub: Subscription = new Subscription();

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.routeSub = this.router.events.subscribe(() => {
      this.hideNavbar = this.router.url === '/login';
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription
    this.routeSub.unsubscribe();
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
}
