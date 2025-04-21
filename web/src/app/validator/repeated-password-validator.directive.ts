import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appRepeatedPassword]',
  standalone: false,
  providers: [
    {provide: NG_VALIDATORS, useExisting: RepeatedPasswordValidatorDirective, multi: true}
  ]
})
export class RepeatedPasswordValidatorDirective implements Validator, OnChanges {
  @Input()
  public password: string;

  private errorMsg = 'Repeated password does not match';
  private onChange = (): void => {};

  ngOnChanges(changes: SimpleChanges): void {
    this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value !== this.password ? {invalid: true, message: this.errorMsg} : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
