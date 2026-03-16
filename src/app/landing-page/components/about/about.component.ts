import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cardsInformation } from './aboutDataComponent';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  readonly cardData = cardsInformation;
  selectedCard = this.cardData[0];
  fadeInClass = true;
  isBelow1400px = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewportWidth();
  }

  ngOnInit(): void {
    this.checkViewportWidth();
  }

  checkViewportWidth(): void {
    this.isBelow1400px = window.innerWidth < 1400;
  }

  selectCard(index: number): void {
    this.selectedCard = this.cardData[index];

    this.fadeInClass = false;
    setTimeout(() => {
      this.fadeInClass = true;
    }, 10);
  }

  trackCard(index: number): number {
    return index;
  }
}
