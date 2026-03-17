import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RevealOnScrollDirective } from '../../../shared/directives/reveal-on-scroll.directive';
import { Language, LanguageService } from '../../../shared/services/language.service';

interface ContactCopy {
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
  buttonLabel: string;
  emailLabel: string;
  mailto: string;
}

const CONTACT_COPY: Record<Language, ContactCopy> = {
  da: {
    eyebrow: 'Kontakt',
    title: 'Tag det første skridt mod <span>dine mål</span>',
    intro:
      'Hvis du vil høre mere om et forløb, starte med en uforpligtende samtale eller bare afklare, hvad der passer til dig, så skriv til mig. Jeg vender tilbage så hurtigt som muligt.',
    points: [
      'Gratis og uforpligtende indledende dialog',
      'Mulighed for både fysisk og online sparring',
      'Fokus på dine mål, udfordringer og hverdagsrammer',
    ],
    buttonLabel: 'Tryk for uforpligtende samtale',
    emailLabel: 'Email',
    mailto:
      'mailto:Fitnessbyjennifer25@gmail.com?subject=Kontakt&body=Hej Jennifer,%0D%0A%0D%0AJeg er interesseret i at høre mere om hvad du tilbyder. Kan vi aftale en tid til en uforpligtende samtale?%0D%0A%0D%0AMvh,%0D%0A[Dit Navn]',
  },
  en: {
    eyebrow: 'Contact',
    title: 'Take the first step toward <span>your goals</span>',
    intro:
      'If you want to hear more about a coaching plan, start with a free intro call, or simply clarify what fits you best, send me a message. I will get back to you as soon as possible.',
    points: [
      'Free, no-obligation introductory conversation',
      'Option for both in-person and online guidance',
      'Focus on your goals, challenges, and everyday life',
    ],
    buttonLabel: 'Start with a free intro call',
    emailLabel: 'Email',
    mailto:
      'mailto:Fitnessbyjennifer25@gmail.com?subject=Contact&body=Hi Jennifer,%0D%0A%0D%0AI am interested in learning more about what you offer. Could we arrange a time for a free intro call?%0D%0A%0D%0ABest regards,%0D%0A[Your Name]',
  },
};

@Component({
  selector: 'app-contact',
  imports: [CommonModule, RevealOnScrollDirective],
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => CONTACT_COPY[this.languageService.language()]);
}
