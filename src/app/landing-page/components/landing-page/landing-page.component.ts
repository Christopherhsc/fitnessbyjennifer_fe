import { Component, OnInit } from '@angular/core';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { HomeComponent } from '../home/home.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ServicesComponent } from '../services/services.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

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
export class LandingPageComponent implements OnInit {
  ngOnInit(): void {
    console.log("kommer vi her?")
  }

}
