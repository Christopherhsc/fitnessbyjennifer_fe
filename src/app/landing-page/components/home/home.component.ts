import { Component, computed, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { LanguageService } from '../../../shared/services/language.service';

const HOME_COPY = {
  da: {
    eyebrow: 'Personlig Træning i København',
    title: 'Byg en stærkere krop med et forløb, der passer til dig.',
    lead:
      'Målrettet træning, personlig sparring og et trygt samarbejde, der giver plads til både ambitioner, hverdag og varige resultater.',
    typewriter: 'Styrke. Balance. Resultater.',
    primaryCta: 'Book en uforpligtende samtale',
    secondaryCta: 'Se mine ydelser',
    imageAlt: 'Jennifer under træning',
    noteLabel: 'Forløb med retning',
    noteTitle: 'Stærkere fysik. Mere energi. Mere ro i processen.',
  },
  en: {
    eyebrow: 'Personal Training in Copenhagen',
    title: 'Build a stronger body with a plan tailored to you.',
    lead:
      'Focused training, personal guidance, and a supportive collaboration with room for ambition, daily life, and lasting results.',
    typewriter: 'Strength. Balance. Results.',
    primaryCta: 'Book a free intro call',
    secondaryCta: 'View my services',
    imageAlt: 'Jennifer during training',
    noteLabel: 'Coaching with direction',
    noteTitle: 'A stronger body. More energy. More calm in the process.',
  },
} as const;

@Component({
  selector: 'app-home',
  imports: [RevealOnScrollDirective],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => HOME_COPY[this.languageService.language()]);
}
