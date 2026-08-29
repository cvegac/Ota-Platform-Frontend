import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarOptionComponent } from './bar-option.component';

describe('BarOptionComponent', () => {
  let component: BarOptionComponent;
  let fixture: ComponentFixture<BarOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
