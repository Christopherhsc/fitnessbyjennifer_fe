import { Component } from '@angular/core';
import { cardsInformation } from '../about/aboutDataComponent';
import { CommonModule } from '@angular/common';
import { plansInformation } from './servicesDataComponent';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  plansData = plansInformation;
  isVisible: boolean[] = [];

  toggleVisibility(index: number) {
    this.isVisible[index] = !this.isVisible[index];
  }
}
