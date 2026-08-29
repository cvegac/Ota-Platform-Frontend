import { Component, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericHash } from '../../interfaces/commons.interface';

@Component({
  selector: 'app-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  imports: [FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent implements ControlValueAccessor{
  readonly options = input<GenericHash[]>([]);

  disabled = model<boolean>(false);
  selectFocus = false;
  selectedOption: GenericHash | undefined;
  optionValue?: string;
  placeholder = input<string>('');
  onChange: any = () => {};
  onTouched: any = () => {};
  writeValue(obj: GenericHash): void {
    if(obj === undefined || obj === null) {return};
    this.selectedOption = this.options().find(o => o.key === obj.key && o.value === obj.value);
    this.optionValue = this.selectedOption?.value;
    this.selectFocus = false;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled) ;
  }
  selectValue(key: string){
    this.selectedOption = this.options().find(o => o.key === key);
    this.optionValue = this.selectedOption?.value;
    this.onChange(this.selectedOption);
    this.onTouched();
    this.selectFocus = false;
  }

  onFocus() {
    this.selectFocus = true;
  }
  onBlur() {
    this.selectFocus = false;
  }

}
