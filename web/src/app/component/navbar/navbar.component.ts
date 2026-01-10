import {Component, inject} from '@angular/core';
import {User} from '../../domain/user/model/user';
import {UserService} from '../../domain/user/user.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ProfileComponent} from '../../domain/user/component/profile/profile.component';
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private readonly userService = inject(UserService);
  private readonly modalService = inject(BsModalService);

  public user = this.userService.user;

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
