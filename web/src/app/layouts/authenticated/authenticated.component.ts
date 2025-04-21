import {Component, OnInit} from '@angular/core';
import {UserService} from '../../domain/user/user.service';

@Component({
  selector: 'app-authenticated',
  standalone: false,
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss']
})
export class AuthenticatedComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.get();
  }
}
