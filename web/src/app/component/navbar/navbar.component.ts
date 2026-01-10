import {Component} from '@angular/core';
import {User} from '../../domain/user/model/user';
import {UserService} from '../../domain/user/user.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ProfileComponent} from '../../domain/user/component/profile/profile.component';
import {RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public user = toSignal(this.userService.user$);

  constructor(private readonly userService: UserService,
              private readonly modalService: BsModalService) {
  }

  public getProfilePicSrc(user: User): string {
    if (user.profilePic) {
      return `data:${user.profilePic.type};base64,${user.profilePic.content}`;
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
