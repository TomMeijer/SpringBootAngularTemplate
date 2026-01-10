import {Component, effect, inject, signal} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {UserService} from '../../user.service';
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
export class ProfileComponent {
  public modalRef = inject(BsModalRef);
  private readonly userService = inject(UserService);

  public user = this.userService.user;
  public request: UpdateUserRequest = {};
  public formChanged = signal(false);
  public wasValidated = signal(false);
  public isSubmitting = signal(false);
  public isDeleting = signal(false);

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this.request.firstName = user.firstName;
        this.request.lastName = user.lastName;
        if (user.profilePic) {
          this.request.profilePic = FileUtils.base64ToFile(user.profilePic.content, user.profilePic.type, user.profilePic.name);
        }
      }
    });
  }

  public updateUser(form: NgForm): void {
    this.wasValidated.set(!form.valid);
    if (!form.valid || this.isSubmitting() || !this.formChanged()) {
      return;
    }
    this.isSubmitting.set(true);
    this.userService.update(this.request).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.userService.get();
        this.modalRef.hide();
      },
      error: () => this.isSubmitting.set(false)
    });
  }

  public deleteUser(): void {
    if (this.isDeleting()) {
      return;
    }
    this.isDeleting.set(true);
    this.userService.delete().subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.modalRef.hide();
        this.userService.logout();
      },
      error: () => this.isDeleting.set(false)
    });
  }
}
