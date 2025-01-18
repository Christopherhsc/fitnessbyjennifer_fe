import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./shared/components/header/header.component";
import { HomeComponent } from "./landing-page/components/home/home.component";
import { ServicesComponent } from "./landing-page/components/services/services.component";
import { AboutComponent } from "./landing-page/components/about/about.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HomeComponent, ServicesComponent, AboutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
