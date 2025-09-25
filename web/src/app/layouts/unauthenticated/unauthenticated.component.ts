import { Component } from '@angular/core';
import {NavbarComponent} from "../../component/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../component/footer/footer.component";

@Component({
  selector: 'app-unauthenticated',
  templateUrl: './unauthenticated.component.html',
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent
  ],
  styleUrls: ['./unauthenticated.component.scss']
})
export class UnauthenticatedComponent {

}
