import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Language, LanguageService } from '../../services/language.service';

interface FooterCopy {
  description: string;
}

const FOOTER_COPY: Record<Language, FooterCopy> = {
  da: {
    description: 'Personlig træning og vejledning med fokus på ro, struktur og varige resultater.',
  },
  en: {
    description: 'Personal training and guidance with a focus on calm, structure, and lasting results.',
  },
};

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  private readonly languageService = inject(LanguageService);

  readonly content = computed(() => FOOTER_COPY[this.languageService.language()]);
}
