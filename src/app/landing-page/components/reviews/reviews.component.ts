import { Component } from '@angular/core';
import { customerReviews } from './reviewsDataComponent';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  reviews = customerReviews
}
