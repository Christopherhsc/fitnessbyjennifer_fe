import { Component, HostListener, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cardsInformation } from './aboutDataComponent';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface AboutCopy {
  eyebrow: string;
  title: string;
  intro: string;
  active: string;
  readMore: string;
  highlights: string[];
}

const ABOUT_COPY: Record<Language, AboutCopy> = {
  da: {
    eyebrow: 'Om Jennifer',
    title: 'En coach, der ser <span>hele dig</span>',
    intro:
      'Et godt forløb bygger på tillid, tydelig retning og realistiske rammer. Derfor starter vi med at forstå din situation, dine mål og hvad der skal til for, at du kan lykkes over tid.',
    active: 'Aktiv',
    readMore: 'Læs mere',
    highlights: [
      'Gratis indledende samtale med fokus på din hverdag og dine behov',
      'Et tydeligt næste skridt, så du altid ved hvad du arbejder hen imod',
      'Et forløb der er realistisk, menneskeligt og målbart',
    ],
  },
  en: {
    eyebrow: 'About Jennifer',
    title: 'A coach who sees <span>the whole you</span>',
    intro:
      'A strong coaching process is built on trust, clear direction, and realistic conditions. That is why we start by understanding your situation, your goals, and what it will take for you to succeed over time.',
    active: 'Active',
    readMore: 'Read more',
    highlights: [
      'A free introductory call focused on your daily life and your needs',
      'A clear next step so you always know what you are working toward',
      'A process that is realistic, human, and measurable',
    ],
  },
};

@Component({
  selector: 'app-about',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => ABOUT_COPY[this.languageService.language()]);
  readonly cardData = computed(() => cardsInformation[this.languageService.language()]);
  selectedCardIndex = 0;
  fadeInClass = true;
  isBelow1400px = false;

  readonly selectedCard = computed(() => this.cardData()[this.selectedCardIndex]);

  @HostListener('window:resize')
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
    this.selectedCardIndex = index;

    this.fadeInClass = false;
    setTimeout(() => {
      this.fadeInClass = true;
    }, 10);
  }

  trackCard(index: number): number {
    return index;
  }
}
