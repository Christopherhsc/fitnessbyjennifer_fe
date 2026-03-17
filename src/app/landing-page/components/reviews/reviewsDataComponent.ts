import { Language } from '../../../shared/services/language.service';

export interface CustomerReview {
  name: string;
  reviewText: string;
  rating: number;
}

export const customerReviews: Record<Language, CustomerReview[]> = {
  da: [
    {
      name: 'Kristiane',
      reviewText:
        'Med hjælp fra Jennifer har jeg fundet en kærlighed til træning og til mig selv, som jeg ikke troede var mulig. Forløbet har givet mig både retning, mod og lyst til at holde fast.',
      rating: 5,
    },
    {
      name: 'Maria',
      reviewText:
        'Jennifer møder dig med ro, faglighed og en plan, der faktisk passer til virkeligheden. Jeg følte mig set fra start, og det gjorde en stor forskel for mine resultater.',
      rating: 5,
    },
    {
      name: 'Louise',
      reviewText:
        'Jeg havde brug for struktur uden at blive presset ind i en standardløsning. Det fik jeg her. Jeg stod tilbage med mere energi, bedre vaner og en langt stærkere tro på mig selv.',
      rating: 5,
    },
  ],
  en: [
    {
      name: 'Kristiane',
      reviewText:
        'With Jennifer’s help, I found a love for training and for myself that I did not think was possible. The process gave me direction, courage, and the motivation to keep going.',
      rating: 5,
    },
    {
      name: 'Maria',
      reviewText:
        'Jennifer meets you with calm, professionalism, and a plan that actually fits real life. I felt seen from the start, and that made a huge difference to my results.',
      rating: 5,
    },
    {
      name: 'Louise',
      reviewText:
        'I needed structure without being forced into a standard solution. That is exactly what I got here. I came away with more energy, better habits, and much stronger belief in myself.',
      rating: 5,
    },
  ],
};
