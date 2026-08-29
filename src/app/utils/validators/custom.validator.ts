import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidator{
  static allowedValues(allowedValues: string[]): ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      return allowedValues.includes(control.value) ? null : { allowedValues: true };
    };
  }
}
