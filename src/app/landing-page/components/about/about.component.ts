import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cardsInformation } from './aboutDataComponent';


@Component({
  selector: 'app-about',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  cardData = cardsInformation;
  selectedCard = this.cardData[0];
  fadeInClass = true;
  isBelow1400px = false;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewportWidth();
  }

  ngOnInit() {
    this.checkViewportWidth();
  }

  checkViewportWidth() {
    this.isBelow1400px = window.innerWidth < 1400;
  }

  // Method to handle card selection
  selectCard(index: number) {
    this.selectedCard = this.cardData[index];

    // Reset fade-in effect
    this.fadeInClass = false;
    setTimeout(() => {
      this.fadeInClass = true;
    }, 10);
  }
}
