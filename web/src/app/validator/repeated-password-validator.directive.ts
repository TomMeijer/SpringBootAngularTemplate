import {Directive, Input, OnChanges} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
  selector: '[appRepeatedPassword]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: RepeatedPasswordValidatorDirective, multi: true}
  ]
})
export class RepeatedPasswordValidatorDirective implements Validator, OnChanges {
  @Input()
  public password: string;

  private readonly errorMsg = 'Repeated password does not match';
  private onChange = (): void => {};

  ngOnChanges(): void {
    this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return control.value !== this.password ? {invalid: true, message: this.errorMsg} : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onChange = fn;
  }
}
