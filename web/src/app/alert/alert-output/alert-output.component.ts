import { Component } from '@angular/core';
import {AlertService} from '../alert.service';
import {Alert} from '../alert';

@Component({
  selector: 'app-alert-output',
  templateUrl: './alert-output.component.html',
  styleUrls: ['./alert-output.component.scss']
})
export class AlertOutputComponent {

  constructor(private alertService: AlertService) {
  }

  get alerts(): Alert[] {
    return this.alertService.alerts;
  }

  public handleClose(closedAlert: Alert): void {
    this.alertService.dismiss(closedAlert);
  }
}
