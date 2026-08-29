import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiComponent } from './hi.component';

describe('HiComponent', () => {
  let component: HiComponent;
  let fixture: ComponentFixture<HiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
