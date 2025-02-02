import { Component } from '@angular/core';
import { AboutComponent } from '../components/about/about.component';
import { ContactComponent } from '../components/contact/contact.component';
import { HomeComponent } from '../components/home/home.component';
import { ReviewsComponent } from '../components/reviews/reviews.component';
import { ServicesComponent } from '../components/services/services.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    HomeComponent,
    AboutComponent,
    ServicesComponent,
    ReviewsComponent,
    ContactComponent,
    FooterComponent,
  ],
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',

})
export class LandingPageComponent  {


}
