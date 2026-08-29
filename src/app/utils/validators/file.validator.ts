import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FileValidator {

    static fileMaxSize(maxSize: number): ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value as File;
            return file && file.size <= maxSize ? null : { maxSize: true };
        };
    }
    static minSize = (minSize: number): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value as File;
            return file && file.size >= minSize ? null : { minSize: true };
        };
    }

    static fileType = (fileType: string): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value as File;
            return file && file.type === fileType ? null : { fileType: true };
        };
    }
    static fileExtension = (fileExtension: string): ValidatorFn => {
        return (control: AbstractControl): ValidationErrors | null => {
            const file = control.value as File;
            return file && file.name.endsWith(fileExtension) ? null : { fileExtension: true };
        };
    }
}
