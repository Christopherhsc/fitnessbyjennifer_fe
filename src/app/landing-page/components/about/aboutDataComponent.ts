import { Language } from '../../../shared/services/language.service';

export interface AboutCard {
  cardTitle: string;
  cardText: string;
  image: string;
}

export const cardsInformation: Record<Language, AboutCard[]> = {
  da: [
    {
      cardTitle: 'En personlig tilgang',
      cardText:
        'Mit navn er Jennifer Rasmussen, og jeg arbejder med mennesker, der vil skabe en sundere og mere balanceret hverdag uden at miste sig selv i processen. Hos mig handler et forløb om at bygge noget, der kan holde i virkeligheden.',
      image: '/JenniferCard4.jpg',
    },
    {
      cardTitle: 'Faglighed med nærvær',
      cardText:
        'Som uddannet personlig træner og kostvejleder kombinerer jeg faglig viden, struktur og tæt sparring. Jeg guider dig mod dine mål med et forløb, der er tilpasset din krop, din hverdag og det tempo, der giver mening for dig.',
      image: '/JenniferCard3.jpg',
    },
    {
      cardTitle: 'Træning i København',
      cardText:
        'Jeg er baseret i København, hvor fysiske træningsforløb foregår i professionelle rammer hos SHC. Det giver ro, kvalitet og plads til at fokusere på udvikling, teknik og de resultater, du arbejder hen imod.',
      image: '/JenniferCard2.jpg',
    },
  ],
  en: [
    {
      cardTitle: 'A personal approach',
      cardText:
        'My name is Jennifer Rasmussen, and I work with people who want to build a healthier, more balanced everyday life without losing themselves in the process. For me, coaching is about building something that works in real life.',
      image: '/JenniferCard4.jpg',
    },
    {
      cardTitle: 'Expertise with presence',
      cardText:
        'As a certified personal trainer and nutrition coach, I combine professional knowledge, structure, and close support. I guide you toward your goals with a process adapted to your body, your routine, and a pace that makes sense for you.',
      image: '/JenniferCard3.jpg',
    },
    {
      cardTitle: 'Training in Copenhagen',
      cardText:
        'I am based in Copenhagen, where in-person training takes place in a professional setting at SHC. That creates calm, quality, and space to focus on your development, technique, and the results you are working toward.',
      image: '/JenniferCard2.jpg',
    },
  ],
};
