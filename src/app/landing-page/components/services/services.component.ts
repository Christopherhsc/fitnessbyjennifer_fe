import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { plansInformation } from './servicesDataComponent';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-services',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  readonly plansData = plansInformation;

  trackPlan(index: number): number {
    return index;
  }
}
