import {Injectable} from '@angular/core';
import {Alert} from './alert';
import {AlertType} from './alert-type.enum';

const DEFAULT_TIMEOUT = 3500;

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public alerts: Alert[] = [];

  constructor() { }

  public show(message: string, type: AlertType, timeout?: number): void {
    this.alerts.push({message: message, type: type, timeout: timeout});
    if (this.alerts.length > 1) {
      this.dismissPrevious();
    }
  }

  private dismissPrevious(): void {
    const previousAlert = this.alerts[this.alerts.length - 2];
    setTimeout(() => this.dismiss(previousAlert), DEFAULT_TIMEOUT);
  }

  public showSuccess(message: string, timeout = DEFAULT_TIMEOUT): void {
    this.show(message, AlertType.Success, timeout);
  }

  public showDanger(message: string, timeout?: number): void {
    this.show(message, AlertType.Danger, timeout);
  }

  public dismiss(dismissedAlert: Alert): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  public clear(): void {
    this.alerts = [];
  }
}
