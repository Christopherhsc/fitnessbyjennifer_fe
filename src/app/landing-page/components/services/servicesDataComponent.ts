import { Language } from '../../../shared/services/language.service';

export interface ServicePlan {
  planTitle: string;
  planText: string;
  dotPoints: string[];
}

export const plansInformation: Record<Language, ServicePlan[]> = {
  da: [
    {
      planTitle: 'Personlig Træning',
      planText:
        'En personlig træner er det rigtige valg for dig, hvis du ønsker at udfordre dig selv, blive klogere på din egen krop samt opnå resultater, du måske ikke har kunne opnå før. Jeg mener, at god kemi og et stærkt samarbejde er essentielt, når det omhandler personlig træning. På baggrund af det, vil jeg altid tage en uformel og uforpligtende samtale, hvor vi sammen snakker om dine forventninger og udarbejder dine målsætninger. Et forløb hos mig bliver skræddersyet til dine hverdagsmønstre – et forløb skal tilpasses dig, så det er realistisk og motiverende.',
      dotPoints: [
        'Udvikling af en personlig træningsplan.',
        'Fokus på samarbejde og motivation.',
        'Skræddersyede målsætninger.',
        'Fleksible og realistiske forløb.',
      ],
    },
    {
      planTitle: 'Online Personlig Træning',
      planText:
        'Jeg tilbyder også online personlig træning. Et sådan forløb er præcis det samme som et fysisk forløb, dog uden de fysiske træningstimer. Træningsprogrammering, kostvejledning, check-ins samt 1-1 kontakten er præcis den samme som et fysisk forløb hos mig. Der er i dette forløb i højere grad kommunikation telefonisk, da du netop ikke mødes med mig fysisk hver uge. Der er i online personlig træning stor fokus på, at gå i dybden med din kost, træning og livsstil.',
      dotPoints: [
        'Online forløb uden træningstimer.',
        'Programmering, kostvejledning og check-ins.',
        'Telefonisk kommunikation og support.',
        'Fokus på dybdegående kost og livsstil.',
      ],
    },
    {
      planTitle: 'Kostvejledning',
      planText:
        'Som kostvejleder brænder jeg for, at hjælpe mennesker til at opnå en varig livsstilsændring samt dét at føle sig bedre tilpas i sin krop. Det er ofte svært at ændre sin livsstil på egen hånd og derfor kan jeg hjælpe dig med nogle gode værktøjer, nyttig viden samt hjælp, sparring og støtte hele vejen gennem dit forløb OG samtaler efter dit forløb, såfremt behovet for ekstra støtte opstår.',
      dotPoints: [
        'Personlig rådgivning om kost og livsstil.',
        'Værktøjer og støtte til varige ændringer.',
        'Sparring og opfølgning gennem forløbet.',
        'Samtaler efter forløbet ved behov.',
      ],
    },
  ],
  en: [
    {
      planTitle: 'Personal Training',
      planText:
        'Personal training is the right choice if you want to challenge yourself, understand your body better, and achieve results you may not have reached before. I believe good chemistry and a strong collaboration are essential. That is why I always start with an informal, no-obligation conversation where we talk through your expectations and define your goals together. A process with me is tailored to your everyday patterns so it stays realistic and motivating.',
      dotPoints: [
        'Development of a personal training plan.',
        'Focus on collaboration and motivation.',
        'Tailored goals.',
        'Flexible and realistic coaching plans.',
      ],
    },
    {
      planTitle: 'Online Personal Training',
      planText:
        'I also offer online personal training. This process is essentially the same as an in-person one, just without the physical training sessions. Training programming, nutrition guidance, check-ins, and 1:1 support are the same as in a physical course with me. In this format, there is naturally more communication by phone because we do not meet in person every week. Online coaching places a strong focus on going deeper into your nutrition, training, and lifestyle.',
      dotPoints: [
        'Online coaching without physical sessions.',
        'Programming, nutrition guidance, and check-ins.',
        'Phone-based communication and support.',
        'Strong focus on nutrition and lifestyle in depth.',
      ],
    },
    {
      planTitle: 'Nutrition Guidance',
      planText:
        'As a nutrition coach, I am passionate about helping people achieve a lasting lifestyle change and feel better in their bodies. It is often difficult to change your lifestyle on your own, so I help with practical tools, useful knowledge, and support throughout your process, as well as follow-up conversations afterward if extra support is needed.',
      dotPoints: [
        'Personal advice on nutrition and lifestyle.',
        'Tools and support for lasting change.',
        'Guidance and follow-up throughout the process.',
        'Post-program conversations when needed.',
      ],
    },
  ],
};
  
