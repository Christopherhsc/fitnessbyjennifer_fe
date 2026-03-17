import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { plansInformation } from './servicesDataComponent';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface ServicePoint {
  title: string;
  text: string;
}

interface ServicesCopy {
  imageAlt: string;
  whyEyebrow: string;
  whyTitle: string;
  whyIntro: string;
  points: ServicePoint[];
  cta: string;
  plansEyebrow: string;
  plansTitle: string;
  plansIntro: string;
}

const SERVICES_COPY: Record<Language, ServicesCopy> = {
  da: {
    imageAlt: 'Jennifer i træningsmiljø',
    whyEyebrow: 'Hvorfor vælge mig',
    whyTitle: 'Faglighed, struktur og et <span>forløb med retning</span>',
    whyIntro:
      'Jeg arbejder med et klart fokus på dine mål, din krop og din hverdag. Derfor starter vi med en indledende samtale, hvor vi afklarer forventninger, udfordringer og den type støtte, der giver mest værdi for dig.',
    points: [
      {
        title: 'Individuel plan',
        text: 'Træning og vejledning tilpasset dit niveau og din rytme.',
      },
      {
        title: 'Tæt sparring',
        text: 'Løbende justeringer, feedback og fokus på progression.',
      },
    ],
    cta: 'Book en uforpligtende samtale',
    plansEyebrow: 'Ydelser',
    plansTitle: 'Vælg det <span>forløb</span> der passer dig',
    plansIntro:
      'Hvert forløb er bygget op omkring tydelig retning, realistiske delmål og en oplevelse af, at du ved hvad du skal gøre næste gang.',
  },
  en: {
    imageAlt: 'Jennifer in a training environment',
    whyEyebrow: 'Why work with me',
    whyTitle: 'Professional guidance, structure, and <span>clear direction</span>',
    whyIntro:
      'I work with a clear focus on your goals, your body, and your everyday life. That is why we begin with an introductory conversation to clarify expectations, challenges, and the kind of support that will create the most value for you.',
    points: [
      {
        title: 'Individual plan',
        text: 'Training and guidance adapted to your level and rhythm.',
      },
      {
        title: 'Close support',
        text: 'Ongoing adjustments, feedback, and focus on progression.',
      },
    ],
    cta: 'Book a free intro call',
    plansEyebrow: 'Services',
    plansTitle: 'Choose the <span>program</span> that fits you',
    plansIntro:
      'Each program is built around clear direction, realistic milestones, and the feeling that you always know what to do next.',
  },
};

@Component({
  selector: 'app-services',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => SERVICES_COPY[this.languageService.language()]);
  readonly plansData = computed(() => plansInformation[this.languageService.language()]);

  trackPlan(index: number): number {
    return index;
  }
}
