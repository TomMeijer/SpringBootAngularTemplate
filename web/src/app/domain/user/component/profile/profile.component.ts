import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {UserService} from '../../user.service';
import {User} from '../../model/user';
import {UpdateUserRequest} from '../../model/update-user-request';
import {FormsModule, NgForm} from '@angular/forms';
import {FileUtils, TmBootstrapModule} from '@tommeijer/tm-bootstrap';
import {PopoverDirective} from "ngx-bootstrap/popover";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    FormsModule,
    TmBootstrapModule,
    PopoverDirective
  ],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public request: UpdateUserRequest = {};
  public formChanged = false;
  public wasValidated = false;
  public isSubmitting = false;
  public isDeleting = false;

  constructor(public modalRef: BsModalRef,
              private readonly userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.request.firstName = this.user.firstName;
        this.request.lastName = this.user.lastName;
        if (this.user.profilePic) {
          this.request.profilePic = FileUtils.base64ToFile(this.user.profilePic.content, this.user.profilePic.type, this.user.profilePic.name);
        }
      }
    });
  }

  public updateUser(form: NgForm): void {
    this.wasValidated = !form.valid;
    if (!form.valid || this.isSubmitting || !this.formChanged) {
      return;
    }
    this.isSubmitting = true;
    this.userService.update(this.request).subscribe(
      () => {
        this.isSubmitting = false;
        this.userService.get();
        this.modalRef.hide();
      },
      () => this.isSubmitting = false
    );
  }

  public deleteUser(): void {
    if (this.isDeleting) {
      return;
    }
    this.isDeleting = true;
    this.userService.delete().subscribe(
      () => {
        this.isDeleting = false;
        this.modalRef.hide();
        this.userService.logout();
      },
      () => this.isDeleting = false
    );
  }
}
