import {Component, OnInit} from '@angular/core';
import {UserService} from '../../domain/user/user.service';
import {NavbarComponent} from "../../component/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {FooterComponent} from "../../component/footer/footer.component";

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent
  ],
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  constructor(private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.get();
  }
}
