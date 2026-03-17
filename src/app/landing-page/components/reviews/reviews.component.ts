import { Component, computed, inject } from '@angular/core';
import { customerReviews } from './reviewsDataComponent';
import { CommonModule } from '@angular/common';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface ReviewsCopy {
  eyebrow: string;
  title: string;
  intro: string;
}

const REVIEWS_COPY: Record<Language, ReviewsCopy> = {
  da: {
    eyebrow: 'Anmeldelser',
    title: 'Klienter beskriver et samarbejde med <span>ro og resultater</span>',
    intro:
      'Det vigtigste for mig er, at du føler dig tryg, forstået og godt guidet. Her er et lille indblik i, hvordan forløbet opleves fra den anden side.',
  },
  en: {
    eyebrow: 'Reviews',
    title: 'Clients describe a process built on <span>calm and results</span>',
    intro:
      'What matters most to me is that you feel safe, understood, and well guided. Here is a small glimpse of how the process feels from the other side.',
  },
};

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss',
})
export class ReviewsComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => REVIEWS_COPY[this.languageService.language()]);
  readonly reviews = computed(() => customerReviews[this.languageService.language()]);

  getStars(rating: number): number[] {
    return Array.from({ length: rating }, (_, index) => index);
  }
}
