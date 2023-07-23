import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../security/auth.service';
import {User} from '../../domain/user/model/user';
import {UserService} from '../../domain/user/user.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ProfileComponent} from '../../domain/user/component/profile/profile.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: User;

  constructor(private userService: UserService,
              private modalService: BsModalService,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => this.user = user);
  }

  public showProfile(): void {
    this.modalService.show(ProfileComponent);
  }

  public logout(): void {
    this.authService.logout();
  }
}