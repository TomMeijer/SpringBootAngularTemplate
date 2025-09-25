import {Component, OnInit} from '@angular/core';
import {User} from '../../domain/user/model/user';
import {UserService} from '../../domain/user/user.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ProfileComponent} from '../../domain/user/component/profile/profile.component';
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink,
    NgIf
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public user: User;

  constructor(private readonly userService: UserService,
              private readonly modalService: BsModalService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => this.user = user);
  }

  get profilePicSrc(): string {
    if (this.user.profilePic) {
      return `data:${this.user.profilePic.type};base64,${this.user.profilePic.content}`;
    } else {
      return 'assets/img/default_profile.png';
    }
  }

  public showProfile(): void {
    this.modalService.show(ProfileComponent);
  }

  public logout(): void {
    this.userService.logout();
  }
}
