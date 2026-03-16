import { Component } from '@angular/core';
import { customerReviews } from './reviewsDataComponent';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  readonly reviews = customerReviews;

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, index) => index);
  }
}
