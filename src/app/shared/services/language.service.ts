import { Injectable, signal } from '@angular/core';

export type Language = 'da' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'fitnessbyjennifer.language';
  private readonly defaultLanguage: Language = 'da';
  private readonly languageState = signal<Language>(this.readInitialLanguage());

  readonly language = this.languageState.asReadonly();

  constructor() {
    this.persistLanguage(this.languageState());
    this.updateDocumentLanguage(this.languageState());
  }

  setLanguage(language: Language): void {
    this.languageState.set(language);
    this.persistLanguage(language);
    this.updateDocumentLanguage(language);
  }

  toggleLanguage(): void {
    this.setLanguage(this.languageState() === 'da' ? 'en' : 'da');
  }

  private readInitialLanguage(): Language {
    if (typeof localStorage === 'undefined') {
      return this.defaultLanguage;
    }

    const storedLanguage = localStorage.getItem(this.storageKey);
    return storedLanguage === 'en' ? 'en' : this.defaultLanguage;
  }

  private persistLanguage(language: Language): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, language);
  }

  private updateDocumentLanguage(language: Language): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = language;
  }
}
